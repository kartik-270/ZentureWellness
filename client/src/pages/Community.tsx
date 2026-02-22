// app/community/page.tsx  (if using Next.js App Router)
// or src/pages/community.tsx (if using Pages Router)

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { apiConfig } from "@/lib/config";
import { Image as ImageIcon, Loader2 } from "lucide-react";

export default function Community() {
  const [communities, setCommunities] = useState<any[]>([]);
  const [activeCommunity, setActiveCommunity] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [newReplyContent, setNewReplyContent] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [isDMOpen, setIsDMOpen] = useState(false);
  const [dmUserId, setDmUserId] = useState<number | null>(null);
  const [dmUserName, setDmUserName] = useState("");
  const [dmMessages, setDmMessages] = useState<any[]>([]);
  const [newDmContent, setNewDmContent] = useState("");

  const [error, setError] = useState("");

  const getAuthToken = () => localStorage.getItem("authToken");

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const token = getAuthToken();
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${apiConfig.baseUrl}/communities`, { headers });
      if (res.ok) {
        const data = await res.json();
        setCommunities(data);
        if (data.length > 0) {
          setActiveCommunity(data[0]);
          fetchPosts(data[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch communities", err);
    }
  };

  const fetchPosts = async (communityId: number) => {
    try {
      const res = await fetch(`${apiConfig.baseUrl}/communities/${communityId}/posts`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  const handleCommunityChange = (community: any) => {
    setActiveCommunity(community);
    setExpandedPostId(null);
    fetchPosts(community.id);
  };

  const handleCreatePost = async () => {
    if (!newPostTitle || !newPostContent) {
      setError("Title and content are required.");
      return;
    }
    const token = getAuthToken();
    if (!token) {
      setError("You must be logged in to post.");
      return;
    }
    try {
      let uploadedMediaUrl = null;

      if (selectedFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await fetch(`${apiConfig.baseUrl}/upload`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedMediaUrl = uploadData.url;
        } else {
          setError("Failed to upload image. Please try again.");
          setIsUploading(false);
          return;
        }
      }

      setIsUploading(true); // Keep button disabled while creating post

      const res = await fetch(`${apiConfig.baseUrl}/communities/${activeCommunity.id}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newPostTitle,
          content: newPostContent,
          media_url: uploadedMediaUrl
        })
      });
      if (res.ok) {
        setIsPostModalOpen(false);
        setNewPostTitle("");
        setNewPostContent("");
        setSelectedFile(null);
        setError("");
        fetchPosts(activeCommunity.id);
      } else {
        const data = await res.json();
        setError(data.msg || "Failed to create post.");
      }
    } catch (err) {
      setError("Network error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleExpandPost = async (postId: number) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      return;
    }
    setExpandedPostId(postId);
    try {
      const res = await fetch(`${apiConfig.baseUrl}/posts/${postId}/replies`);
      if (res.ok) {
        const data = await res.json();
        setReplies(data);
      }
    } catch (err) {
      console.error("Failed to fetch replies", err);
    }
  };

  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState("");
  const [newCommunityDesc, setNewCommunityDesc] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchCommunities();
    // Parse JWT to get user role (if available)
    const token = getAuthToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
        setCurrentUserId(Number(payload.sub));
      } catch (e) { }
    }
  }, []);

  const handleCreateCommunity = async () => {
    if (!newCommunityName) {
      setError("Community name is required.");
      return;
    }
    const token = getAuthToken();
    if (!token) return;
    try {
      const res = await fetch(`${apiConfig.baseUrl}/communities`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ name: newCommunityName, description: newCommunityDesc })
      });
      if (res.ok) {
        setIsCommunityModalOpen(false);
        setNewCommunityName("");
        setNewCommunityDesc("");
        fetchCommunities();
      } else {
        const data = await res.json();
        setError(data.msg || "Failed to create community.");
      }
    } catch (err) {
      setError("Network error.");
    }
  };

  const handleReplySubmit = async (postId: number) => {
    if (!newReplyContent) return;
    const token = getAuthToken();
    if (!token) {
      alert("Please log in to reply.");
      return;
    }
    try {
      const res = await fetch(`${apiConfig.baseUrl}/posts/${postId}/replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ content: newReplyContent })
      });
      if (res.ok) {
        setNewReplyContent("");
        // Refresh replies
        const replyRes = await fetch(`${apiConfig.baseUrl}/posts/${postId}/replies`);
        if (replyRes.ok) {
          const data = await replyRes.json();
          setReplies(data);
        }
      }
    } catch (err) {
      console.error("Failed to submit reply", err);
    }
  };

  const handleDeletePost = async (postId: number) => {
    const token = getAuthToken();
    if (!token) return;
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`${apiConfig.baseUrl}/posts/${postId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        fetchPosts(activeCommunity.id);
      } else {
        alert("You do not have permission to delete this post.");
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleOpenDM = (userId: number, username: string) => {
    setDmUserId(userId);
    setDmUserName(username);
    setIsDMOpen(true);
    fetchDMs(userId);
  };

  const fetchDMs = async (userId: number) => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const res = await fetch(`${apiConfig.baseUrl}/messages/direct/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDmMessages(data);
      }
    } catch (err) {
      console.error("Failed to fetch DMs", err);
    }
  };

  const handleSendDM = async () => {
    if (!newDmContent || !dmUserId) return;
    const token = getAuthToken();
    if (!token) return;
    try {
      const res = await fetch(`${apiConfig.baseUrl}/messages/direct/${dmUserId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ content: newDmContent })
      });
      if (res.ok) {
        setNewDmContent("");
        fetchDMs(dmUserId);
      }
    } catch (err) {
      console.error("Failed to send DM", err);
    }
  };

  return (
    <div className="bg-gradient-to-b from-sky-100 to-sky-200 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-8 w-full">
        {/* Left Sidebar for Communities */}
        <div className="w-full md:w-1/4">
          <div className="bg-white shadow-md rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-sky-800">Communities/Forums</h3>
              {(userRole === 'admin' || userRole === 'moderator') && (
                <button
                  onClick={() => setIsCommunityModalOpen(true)}
                  className="text-sm bg-sky-100 hover:bg-sky-200 text-sky-700 px-2 py-1 rounded shadow-sm transition"
                  title="Create new community"
                >
                  + New
                </button>
              )}
            </div>
            <ul>
              {communities.map((c) => (
                <li key={c.id} className="mb-2">
                  <button
                    onClick={() => handleCommunityChange(c)}
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${activeCommunity?.id === c.id ? 'bg-sky-600 text-white' : 'text-gray-700 hover:bg-sky-50'}`}
                  >
                    # {c.name}
                  </button>
                </li>
              ))}
              {communities.length === 0 && (
                <p className="text-sm text-gray-500">No communities found.</p>
              )}
            </ul>
          </div>
          {/* Provide a dummy 'Direct Messages' box to match discord style locally */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h3 className="text-xl font-bold text-sky-800 mb-4">Direct Messages</h3>
            <p className="text-sm text-gray-500">Click a user's name on a post to message them.</p>
          </div>
        </div>

        {/* Main Feed Area */}
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-4xl font-bold text-sky-700">{activeCommunity ? `# ${activeCommunity.name}` : 'Community'}</h2>
              <p className="text-gray-700 mt-2">
                {activeCommunity ? activeCommunity.description : "Join our forum for stigma-free support"}
              </p>
            </div>
            {activeCommunity && (
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-full shadow-md transition"
              >
                + New Post
              </button>
            )}
          </div>

          {/* Grid of posts */}
          <div className="grid grid-cols-1 gap-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white shadow-md rounded-xl p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">📋</span>
                    <h3 className="text-xl font-semibold">{post.title}</h3>
                  </div>
                  {(userRole === 'admin' || userRole === 'moderator' || currentUserId === post.author.id) && (
                    <button onClick={() => handleDeletePost(post.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                  )}
                </div>
                <p className="text-gray-800 mb-4 text-md whitespace-pre-wrap">
                  {post.content}
                </p>
                {post.media_url && (
                  <div className="mb-4 rounded-xl overflow-hidden max-w-2xl bg-gray-100 flex items-center justify-center">
                    {post.media_url.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video src={post.media_url} controls className="max-h-96 w-auto object-contain"></video>
                    ) : (
                      <img src={post.media_url} alt="Post attachment" className="max-h-96 w-auto object-contain" />
                    )}
                  </div>
                )}
                <div className="flex justify-between items-center text-sm font-medium text-gray-600 border-t pt-4">
                  <span>
                    <button onClick={() => handleOpenDM(post.author.id, post.author.username)} className="text-sky-600 hover:underline">{post.author.username}</button>
                    {" • "}{new Date(post.timestamp).toLocaleString()}
                  </span>
                  <div className="flex gap-4">
                    <button onClick={() => handleExpandPost(post.id)} className="hover:text-sky-600 transition">💬 {post.reply_count || 0} Replies</button>
                    <span className="cursor-pointer hover:text-red-500 transition">❤ {post.likes_count}</span>
                  </div>
                </div>

                {/* Replies Section */}
                {expandedPostId === post.id && (
                  <div className="mt-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-gray-700 mb-4">Replies</h4>
                    {replies.length === 0 ? (
                      <p className="text-sm text-gray-500 mb-4">No replies yet. Be the first!</p>
                    ) : (
                      <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2">
                        {replies.map(reply => (
                          <div key={reply.id} className="bg-white p-3 rounded shadow-sm">
                            <p className="text-gray-800 text-sm mb-2">{reply.content}</p>
                            <div className="text-xs text-gray-500 flex justify-between">
                              <span onClick={() => handleOpenDM(reply.author.id, reply.author.username)} className="font-medium text-sky-600 cursor-pointer hover:underline">{reply.author.username}</span>
                              <span>{new Date(reply.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newReplyContent}
                        onChange={(e) => setNewReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        className="flex-grow border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
                      />
                      <button onClick={() => handleReplySubmit(post.id)} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                        Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {posts.length === 0 && activeCommunity && (
              <div className="text-center p-12 bg-white rounded-xl shadow-md">
                <span className="text-4xl">📝</span>
                <h3 className="text-lg font-semibold text-gray-600 mt-4">No posts in this community yet.</h3>
                <p className="text-gray-500 mb-4">Start the conversation by creating a new post!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* New Post Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Create Post in #{activeCommunity?.name}</h3>
              <button onClick={() => setIsPostModalOpen(false)} className="text-gray-500 hover:text-gray-800 text-xl font-bold">&times;</button>
            </div>
            {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">{error}</div>}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
              <input
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                placeholder="e.g., Struggling with Finals Stress"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Content</label>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500 h-32"
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <div className="mb-6 flex items-center gap-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                  <ImageIcon size={20} />
                  {selectedFile ? 'Change Media' : 'Attach Media'}
                </button>
              </div>
              {selectedFile && (
                <span className="text-sm text-gray-600 truncate max-w-xs">{selectedFile.name}</span>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setIsPostModalOpen(false); setSelectedFile(null); }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition font-medium disabled:opacity-75"
                disabled={isUploading}
              >
                {isUploading ? <><Loader2 className="animate-spin" size={18} /> Posting...</> : 'Post'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct Messaging Modal */}
      {isDMOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-800">Chat with {dmUserName}</h3>
              <button onClick={() => setIsDMOpen(false)} className="text-gray-500 hover:text-gray-800 text-xl font-bold">&times;</button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-3 mb-4 pr-2">
              {dmMessages.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">No messages yet. Say hi!</p>
              ) : (
                dmMessages.map((m, idx) => {
                  const isMine = String(m.sender_id) === String(dmUserId) ? false : true;
                  // Approximate isMine by checking if they are not the dmUserId
                  return (
                    <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-4 py-2 rounded-lg ${isMine ? 'bg-sky-600 text-white rounded-br-none' : 'bg-slate-100 text-gray-800 rounded-bl-none'}`}>
                        <p className="text-sm">{m.content}</p>
                        <span className={`text-[10px] block mt-1 ${isMine ? 'text-sky-200' : 'text-gray-400'}`}>
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center gap-2 border-t pt-4">
              <input
                type="text"
                value={newDmContent}
                onChange={(e) => setNewDmContent(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendDM()}
                placeholder="Type a message..."
                className="flex-grow border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-500"
              />
              <button onClick={handleSendDM} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Community Modal */}
      {isCommunityModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Create New Community</h3>
              <button onClick={() => setIsCommunityModalOpen(false)} className="text-gray-500 hover:text-gray-800 text-xl font-bold">&times;</button>
            </div>
            {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">{error}</div>}

            <p className="text-sm text-gray-600 mb-4">Communities and Forums are the same thing in this platform. They serve as spaces to group discussions together.</p>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Community Name</label>
              <input
                type="text"
                value={newCommunityName}
                onChange={(e) => setNewCommunityName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                placeholder="e.g., General Wellness"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <textarea
                value={newCommunityDesc}
                onChange={(e) => setNewCommunityDesc(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500 h-24"
                placeholder="What is this community about?"
              ></textarea>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsCommunityModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium">Cancel</button>
              <button onClick={handleCreateCommunity} className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition font-medium">Create</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

