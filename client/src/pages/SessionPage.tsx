import React, { useEffect, useState, useRef } from 'react';
import { useRoute } from "wouter";
import { io, Socket } from "socket.io-client";
import { Loader2, ShieldCheck, VideoOff, Mic, MicOff, Video as VideoIcon, VideoOff as VideoOffIcon, PhoneOff, MessageSquare, Send, X, Phone } from 'lucide-react';
import { apiConfig } from "@/lib/config";

// Default Fallback Configuration
const FALLBACK_RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' }
  ]
};

// Derive socket URL from API config (remove /api suffix if present)
const SOCKET_URL = apiConfig.baseUrl.replace(/\/api\/?$/, "");

const SessionPage = () => {
  const [match, params] = useRoute("/session/:sessionId");
  const sessionId = params?.sessionId;

  // Access & User State
  const [loading, setLoading] = useState(true);
  const [accessGranted, setAccessGranted] = useState(false);
  const [user, setUser] = useState<{ id: number; name: string; role: string } | null>(null);
  const [appointmentId, setAppointmentId] = useState<number | null>(null);
  const [sessionMode, setSessionMode] = useState('video_call');
  const [turnServers, setTurnServers] = useState<any>(FALLBACK_RTC_CONFIG);
  const [errorHeader, setErrorHeader] = useState("Access Denied");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    feedback: '',
    rating: 5,
    helpfulness: 5,
    emotional_state: 'Neutral'
  });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Connection State
  const [status, setStatus] = useState("Initializing connection...");
  const [peerConnected, setPeerConnected] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // Seconds remaining

  // Media State
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Refs
  const socketRef = useRef<Socket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null); // Always in sync with localStream state
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const sessionModeRef = useRef<string>('video_call'); // Ref to track sessionMode in closures

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Actions ---

  const handleRedirection = () => {
    // Backend uses 'counselor' (one L), ensure we match it
    const role = user?.role || localStorage.getItem('userRole') || 'student';
    console.log("Redirecting for role:", role);

    if (role === 'counselor') {
      window.location.href = '/counsellor/dashboard';
    } else if (role === 'admin') {
      window.location.href = '/admin/dashboard';
    } else {
      window.location.href = '/dashboard';
    }
  };

  const hangup = async () => {
    if (confirm("Are you sure you want to end the session?")) {
      const role = user?.role || localStorage.getItem('userRole') || 'student';

      // If student, ask for messaging permission
      if (role === 'student' && appointmentId) {
        if (confirm("Allow counselor to send follow-up messages?")) {
          try {
            const token = localStorage.getItem('authToken');
            await fetch(`${apiConfig.baseUrl}/appointments/${appointmentId}/messaging-permission`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ allow_messaging: true })
            });
          } catch (e) {
            console.error("Failed to save permission:", e);
          }
        }
      }

      if (confirm("Redirect to dashboard now?")) {
        handleRedirection();
      } else {
        // Show feedback form instead of redirecting
        setShowFeedback(true);
      }
    }
  };

  const submitFeedback = async () => {
    setSubmittingFeedback(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${apiConfig.baseUrl}/appointments/${appointmentId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(feedbackForm)
      });

      if (res.ok) {
        setFeedbackSubmitted(true);
        setTimeout(() => handleRedirection(), 2000);
      } else {
        alert("Failed to submit feedback. Redirecting...");
        handleRedirection();
      }
    } catch (e) {
      console.error("Feedback error:", e);
      handleRedirection();
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // Timer Logic
  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      alert("Session time has ended.");
      handleRedirection();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleRedirection]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 1. Verify Access
  useEffect(() => {
    const verifyAccess = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        fail("Authentication Required", "Please log in to join the session.");
        return;
      }
      try {
        const res = await fetch(`${apiConfig.baseUrl}/session/verify/${sessionId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.allowed) {
          setUser(data.user);
          setAppointmentId(data.appointment_id);
          setSessionMode(data.mode);
          sessionModeRef.current = data.mode; // Keep ref in sync
          setAccessGranted(true);

          // Calculate remaining time
          const startTime = new Date(data.startTime).getTime();
          const now = new Date().getTime();
          const bucket = 30 * 60 * 1000; // 30 mins in ms
          const elapsed = now - startTime;
          const remaining = Math.max(0, Math.ceil((bucket - elapsed) / 1000));

          setTimeLeft(remaining);

          // Initial mute state based on mode
          if (data.mode === 'message') setIsMuted(true);

          // Fetch dynamic TURN credentials for reliable mobile-data video calls
          try {
            const turnRes = await fetch(`${apiConfig.baseUrl}/session/turn-credentials`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const turnData = await turnRes.json();
            if (turnData.iceServers) {
              console.log("Fetched Metered TURN Credentials successfully");
              setTurnServers({ iceServers: turnData.iceServers });
            }
          } catch (turnErr) {
            console.error("Failed to fetch TURN credentials, using fallback STUN:", turnErr);
          }

        } else {
          fail("Session Unavailable", data.error || "You do not have permission to join this session.");
        }
      } catch (e) {
        fail("Connection Error", "Could not verify session. Please check your internet.");
      } finally {
        setLoading(false);
      }
    };
    if (sessionId) verifyAccess();
  }, [sessionId]);

  const fail = (header: string, msg: string) => {
    setErrorHeader(header);
    setErrorMsg(msg);
    setLoading(false);
  };

  // 2. Initialize Call Logic
  useEffect(() => {
    if (!accessGranted || !sessionId || !user) return;

    // Connect Socket - Restore default WebSockets now that AWS Gunicorn is fixed
    console.log("Connecting to SocketIO:", SOCKET_URL);
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log("Socket Connected, SID:", socket.id);
      setStatus("Connected. Joining secure room...");
      socket.emit('join-room', { roomId: sessionId, userId: user.id });
    });

    // Re-join room on reconnect to resolve 'Invalid session' error
    socket.io.on('reconnect', () => {
      console.log("Socket reconnected, re-joining room...");
      socket.emit('join-room', { roomId: sessionId, userId: user.id });
    });

    socket.on('user-connected', (userId) => {
      console.log("A peer joined the room:", userId);
      setStatus("Peer joined. Establishing secure connection...");
      setPeerConnected(true);
      // Only initiate offer if we're not already stable/connected
      if (!pcRef.current || pcRef.current.signalingState === 'stable') {
        createOffer();
      }
    });

    socket.on('user-disconnected', (userId) => {
      console.log("Peer disconnected:", userId);
      setStatus("Participant left. Waiting for them to rejoin...");
      setPeerConnected(false);
      setRemoteStream(null);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }

      // Fully destroy the peer connection so it rebuilds cleanly if they rejoin
      // This prevents the "SDP m-lines order doesn't match" renegotiation bug
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
    });

    socket.on('offer', async (data) => {
      console.log("Received Offer");
      setStatus("Incoming connection...");
      setPeerConnected(true);
      handleOffer(data);
    });

    socket.on('answer', async (data) => {
      console.log("Received Answer");
      setStatus("Connection established.");
      handleAnswer(data);
    });

    socket.on('ice-candidate', async (data) => {
      handleCandidate(data);
    });

    socket.on('receive-message', (data) => {
      setMessages(prev => [...prev, { sender: "Peer", text: data.message }]);
    });

    // Get Local Media (if not message mode)
    const initMedia = async () => {
      // Use ref to avoid stale closure - sessionMode from this closure may be outdated
      const currentMode = sessionModeRef.current;
      if (currentMode === 'message') {
        setStatus("Chat Session Active");
        setPeerConnected(true); // Always assume connected UI for chat mode initially
        return;
      }

      try {
        const constraints = {
          audio: true,
          video: currentMode === 'video_call'
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        // Sync ref immediately (before React state update) so socket event handlers can use it
        localStreamRef.current = stream;
        setLocalStream(stream);

        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        // If a peer connection already exists (peer joined before we got media), add tracks now
        if (pcRef.current) {
          console.log("PC already exists, adding late-arriving local tracks");
          stream.getTracks().forEach(track => {
            pcRef.current!.addTrack(track, stream);
          });
        }

      } catch (err) {
        console.error("Media Access Error:", err);
        setStatus("Error accessing Camera/Microphone. Check permissions.");
      }
    };

    initMedia();

    return () => {
      console.log("Cleaning up session...");
      socket.disconnect();
      if (localStream) localStream.getTracks().forEach(t => t.stop());
      if (pcRef.current) pcRef.current.close();
    };
  }, [accessGranted, sessionId]);

  // --- Stream Element Assignment ---
  // Ensuring srcObject is set even when elements are conditionally rendered
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      console.log("Setting local video srcObject");
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, localVideoRef.current, isVideoOff]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      console.log("Setting remote video srcObject");
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, remoteVideoRef.current]);


  // --- WebRTC Core ---

  const createPeerConnection = () => {
    if (pcRef.current) return pcRef.current;

    console.log("Creating RTCPeerConnection with servers:", turnServers);
    const pc = new RTCPeerConnection(turnServers);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Local ICE Candidate found:", event.candidate.type);
        socketRef.current?.emit('ice-candidate', {
          roomId: sessionId,
          candidate: event.candidate
        });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("Connection State Change:", pc.connectionState);
      if (pc.connectionState === 'connected') setStatus("Securely Connected");
      if (pc.connectionState === 'failed') setStatus("Connection Failed: Mobile Network / Firewalled. Need TURN server.");
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", pc.iceConnectionState);
      if (pc.iceConnectionState === 'failed') {
        console.error("ICE FAILED: This proves STUN failed and TURN is required (CG-NAT / strict firewall).");
        setStatus("ICE Failed (Network blocked video). A TURN server is required.");
      }
    };

    // Auto-renegotiate when tracks are added after PC creation (handles late-stream race condition)
    pc.onnegotiationneeded = async () => {
      try {
        console.log("Renegotiating due to track addition...");

        // CRITICAL FIX: To prevent "m-lines order doesn't match", we MUST ensure
        // the signaling state is perfectly stable before creating a new offer while a connection is live.
        if (pc.signalingState !== 'stable') {
          console.warn("Skipping renegotiation because signaling state is", pc.signalingState);
          return;
        }

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketRef.current?.emit('offer', { roomId: sessionId, offer });
      } catch (e) {
        console.error("Renegotiation error:", e);
      }
    };

    pc.ontrack = (event) => {
      console.log("Remote track received:", event.track.kind);
      const stream = event.streams[0];
      setRemoteStream(stream);
      setPeerConnected(true);
      setStatus("Active Session");
    };

    // Add local tracks — use ref so we always get the live stream value
    const stream = localStreamRef.current;
    if (stream) {
      console.log("Adding local tracks to PC");
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
    } else {
      console.warn("createPeerConnection: localStream not yet available, tracks will be added when stream arrives");
    }

    pcRef.current = pc;
    return pc;
  };

  const createOffer = async () => {
    console.log("Creating Offer");
    const pc = createPeerConnection();
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketRef.current?.emit('offer', { roomId: sessionId, offer });
    } catch (err) {
      console.error("Offer Creation Error:", err);
    }
  };

  const handleOffer = async (data: any) => {
    console.log("Handling Offer");
    const pc = createPeerConnection();
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socketRef.current?.emit('answer', { roomId: sessionId, answer });
    } catch (err) {
      console.error("Handle Offer Error:", err);
    }
  };

  const handleAnswer = async (data: any) => {
    console.log("Handling Answer");
    if (!pcRef.current) return;
    try {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
    } catch (err) {
      console.error("Handle Answer Error:", err);
    }
  };

  const handleCandidate = async (data: any) => {
    console.log("Adding Remote ICE Candidate");
    if (!pcRef.current) return;
    try {
      await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
    } catch (err) {
      console.error("Handle Candidate Error:", err);
    }
  };


  // --- Actions ---

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(t => t.enabled = !t.enabled);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(t => t.enabled = !t.enabled);
      setIsVideoOff(!isVideoOff);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    socketRef.current?.emit('chat-message', { roomId: sessionId, message: inputText });
    setMessages(prev => [...prev, { sender: "You", text: inputText }]);
    setInputText("");
  };


  // --- Render ---

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin h-10 w-10 text-blue-600 mb-4" />
      <p className="text-gray-600">Verifying secure session...</p>
    </div>
  );

  if (errorMsg) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="bg-red-100 p-4 rounded-full mb-4">
        <VideoOff className="h-10 w-10 text-red-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{errorHeader}</h1>
      <p className="text-gray-600 max-w-md mb-6">{errorMsg}</p>
      <a href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Return Home</a>
    </div>
  );

  // --- MODE: CHAT ONLY ---
  if (sessionMode === 'message') {
    return (
      <div className="h-screen w-full bg-gray-100 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white p-4 shadow-sm flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full"><MessageSquare className="text-blue-600" /></div>
            <div>
              <h2 className="font-bold text-gray-800">Secure Consultation Chat</h2>
              <div className="text-xs text-green-600 flex items-center gap-1">
                {timeLeft !== null && (
                  <span className={`font-mono font-bold mr-2 ${timeLeft < 300 ? 'text-red-500' : 'text-gray-500'}`}>
                    {formatTime(timeLeft)}
                  </span>
                )}
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Active Session
              </div>
            </div>
          </div>
          <button onClick={hangup} className="text-red-500 font-medium hover:bg-red-50 px-3 py-1 rounded">End Chat</button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-100">
          <div className="max-w-3xl mx-auto p-4 space-y-4 h-full flex flex-col justify-end min-h-0">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-10">
                <ShieldCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Messages are end-to-end encrypted.</p>
                <p>Start the conversation...</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${m.sender === 'You' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 border-t">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-100 border-none rounded-full px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button type="submit" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition shadow-md">
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- MODE: VIDEO & VOICE ---
  return (
    <div className="h-screen w-full bg-gray-900 text-white flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <ShieldCheck className="text-green-400" />
          <span className="font-semibold tracking-wide text-lg shadow-black drop-shadow-md">
            Zenture Secure {sessionMode === 'voice_call' ? 'Voice' : 'Video'}
          </span>
        </div>
        <div className="flex flex-col items-end pointer-events-auto">
          {timeLeft !== null && (
            <div className={`text-xl font-mono font-bold px-3 py-1 rounded mb-1 shadow-lg ${timeLeft < 300 ? 'bg-red-600 animate-pulse' : 'bg-black/50'}`}>
              {formatTime(timeLeft)}
            </div>
          )}
          <div className="text-sm opacity-80 bg-black/40 px-3 py-1 rounded-full">{status}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative flex items-center justify-center bg-gray-800">
        {sessionMode === 'video_call' ? (
          // VIDEO LAYOUT
          <>
            {remoteStream ? (
              <video ref={remoteVideoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500 animate-pulse">
                <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <VideoIcon className="w-10 h-10 opacity-50" />
                </div>
                <p>{peerConnected ? "Establishing media stream..." : "Waiting for participant ..."}</p>
              </div>
            )}
            {/* Local PIP */}
            <div className="absolute bottom-6 right-6 w-32 h-48 sm:w-48 sm:h-36 bg-black rounded-lg overflow-hidden border-2 border-gray-700 shadow-2xl z-10">
              {localStream && !isVideoOff ? (
                <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <span className="text-xl font-bold text-gray-500">{user?.name[0]}</span>
                </div>
              )}
            </div>
          </>
        ) : (
          // VOICE CALL LAYOUT
          <div className="flex flex-col items-center justify-center space-y-8">
            <audio ref={remoteVideoRef} autoPlay playsInline />
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg z-10 relative">
                <Phone className="w-12 h-12 text-white" />
              </div>
              {/* Ripple animation if connected */}
              {peerConnected && (
                <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-blue-500 opacity-20 animate-ping"></div>
              )}
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold">{peerConnected ? "Connected" : "Calling..."}</h2>
              <p className="text-gray-400 mt-2">{status}</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="h-24 bg-black/80 backdrop-blur-md flex items-center justify-center gap-8 z-20 pb-4">
        <button onClick={toggleMute} className={`p-4 rounded-full transition transform hover:scale-110 ${isMuted ? "bg-red-500 text-white" : "bg-gray-700 text-white"}`}>
          {isMuted ? <MicOff /> : <Mic />}
        </button>

        {sessionMode === 'video_call' && (
          <button onClick={toggleVideo} className={`p-4 rounded-full transition transform hover:scale-110 ${isVideoOff ? "bg-red-500 text-white" : "bg-gray-700 text-white"}`}>
            {isVideoOff ? <VideoOffIcon /> : <VideoIcon />}
          </button>
        )}

        <button onClick={hangup} className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transform hover:scale-110 shadow-lg">
          <PhoneOff className="w-6 h-6" />
        </button>

        {/* Chat Toggle (Overlay for video/voice) */}
        <button onClick={() => alert("Quick chat overlay coming soon! Use audio for now.")} className="p-4 rounded-full bg-gray-700 text-white hover:bg-gray-600 transform hover:scale-110">
          <MessageSquare />
        </button>
      </div>

      {/* Feedback Overlay */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-gray-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16"></div>
            
            {feedbackSubmitted ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mx-auto mb-6">
                  <ShieldCheck size={40} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Thank You!</h2>
                <p className="text-gray-500 font-medium">Your feedback has been recorded. Redirecting you home...</p>
              </div>
            ) : (
              <div className="relative z-10">
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-1">Session Feedback</h2>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-8">Role: {user?.role}</p>

                <div className="space-y-6">
                  {user?.role === 'student' ? (
                    <>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">How do you feel now?</label>
                        <select 
                          className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 font-bold text-gray-700 outline-none ring-2 ring-transparent focus:ring-blue-500 transition-all"
                          value={feedbackForm.emotional_state}
                          onChange={e => setFeedbackForm({...feedbackForm, emotional_state: e.target.value})}
                        >
                          {['Happy', 'Relieved', 'Calm', 'Neutral', 'Sad', 'Anxious'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Session Helpfulness (1-5)</label>
                          <input 
                            type="number" min="1" max="5"
                            className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 font-bold text-gray-700 outline-none ring-2 ring-transparent focus:ring-blue-500 transition-all"
                            value={feedbackForm.helpfulness}
                            onChange={e => setFeedbackForm({...feedbackForm, helpfulness: parseInt(e.target.value)})}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Counselor Rating (1-5)</label>
                          <input 
                            type="number" min="1" max="5"
                            className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 font-bold text-gray-700 outline-none ring-2 ring-transparent focus:ring-blue-500 transition-all"
                            value={feedbackForm.rating}
                            onChange={e => setFeedbackForm({...feedbackForm, rating: parseInt(e.target.value)})}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Student's Emotional State (Assessment)</label>
                      <input 
                        className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 font-bold text-gray-700 outline-none ring-2 ring-transparent focus:ring-blue-500 transition-all"
                        placeholder="e.g. Improved, Stable, Crisis"
                        value={feedbackForm.emotional_state}
                        onChange={e => setFeedbackForm({...feedbackForm, emotional_state: e.target.value})}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                      {user?.role === 'student' ? 'Share your experience...' : 'Case notes and feedback about student...'}
                    </label>
                    <textarea 
                      className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 font-bold text-gray-700 outline-none ring-2 ring-transparent focus:ring-blue-500 transition-all min-h-[120px]"
                      placeholder="Type here..."
                      value={feedbackForm.feedback}
                      onChange={e => setFeedbackForm({...feedbackForm, feedback: e.target.value})}
                    />
                  </div>

                  <button 
                    onClick={submitFeedback}
                    disabled={submittingFeedback}
                    className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submittingFeedback ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                    Submit Final Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default SessionPage;
