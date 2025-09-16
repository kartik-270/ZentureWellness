import { useState } from "react";
import { Play, BookOpen, Headphones, X, Smile, Search, Gamepad2 } from "lucide-react";

const data = [
  {
    title: "How mindfulness changes the emotional life of our brains | Richard J. Davidson",
    description: "17-min video",
    type: "video",
    link: "https://www.youtube.com/watch?v=7CBfCW67xT8",
    image: "https://images.pexels.com/photos/1036856/pexels-photo-1036856.jpeg",
  },
  {
    title: "Building Resilience: A Guide",
    description: "12-min read",
    type: "article",
    link: "https://www.apa.org/topics/resilience/building-your-resilience",
    image: "https://cdn2.psychologytoday.com/assets/styles/manual_crop_3_2_600x400/public/teaser_image/blog_entry/2025-03/pexels-ivan-samkov-5676744.jpg?itok=gCTxLgRX",
    content: "Resilience is the process and outcome of successfully adapting to difficult or challenging life experiences, especially through mental, emotional, and behavioral flexibility and adjustment to external and internal demands. This guide offers strategies to help you build your own resilience.",
  },
  {
    title: "Breathing Exercise",
    description: "8-min video",
    type: "video",
    link: "https://www.youtube.com/watch?v=p8oxM5j9eNE",
    image: "https://www.browsewellness.com/wp-content/uploads/2023/05/group-of-young-women-practicing-yoga-morning-medi-2021-08-26-20-10-53-utc-1024x683.jpg",
  },
  {
    title: "Guided Sleep Meditation",
    description: "8-min audio",
    type: "audio",
    link: "https://insighttimer.com/rhiframe/guided-meditations/8-minute-meditation-for-a-restful-sleep",
    image: "https://www.hellomyyoga.com/blog/wp-content/uploads/2024/02/what-is-guided-meditation.webp",
  },
  {
    title: "Coping with Social Anxiety",
    description: "8-min video",
    type: "video",
    link: "https://www.youtube.com/watch?v=YqM-17Iw_2k",
    image: "https://nationalsocialanxietycenter.com/wp-content/uploads/2015/04/socialanx.jpg",
  },
  {
    title: "Morning Motivation Podcast",
    description: "15-min audio",
    type: "audio", // Changed from video to audio for consistency
    link: "https://www.youtube.com/watch?v=BjVPyzegUOQ", // This is a YouTube link, but we can treat it as audio-focused content
    image: "https://www.shutterstock.com/image-photo/content-creator-woman-host-streaming-260nw-2178252193.jpg",
  },
  {
    title: "Healthy Relationships 101",
    description: "5-min audio",
    type: "audio",
    link: "https://podcasts.apple.com/sa/podcast/5-minute-boost-healthy-relationship-boundaries-self-care/id1818853383?i=1000723049763&l=ar",
    image: "https://www.mountainside.com/wp-content/uploads/2023/01/healthy-relationship-couple.jpg",
  },
  {
    title: "Mind Relaxing Games",
    description: "Interactive Game",
    type: "interactive",
    link: "https://blackgrain.itch.io/puzzle-vibes",
    image: "https://www.dispatch.com/gcdn/authoring/2020/03/12/NCOD/ghows-OH-a0a972f7-29e8-2791-e053-0100007fe6e2-1f6dbcb6.jpeg",
    content: "Engage your mind with calming puzzles designed to promote relaxation and focus.",
  },
];

const renderIcon = (type) => {
  switch (type) {
    case "video":
      return <Play className="text-primary" size={20} />;
    case "article":
      return <BookOpen className="text-primary" size={20} />;
    case "audio":
      return <Headphones className="text-primary" size={20} />;
    case "interactive":
      return <Gamepad2 className="text-primary" size={20} />;
    default:
      return <Smile className="text-primary" size={20} />;
  }
};

const filters = ["all", "video", "article", "audio", "interactive"];

export default function Psychoeducational() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleCardClick = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url.includes("youtube.com/watch?v=")) return null;
    const videoId = url.split("v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  };

  const filteredData = data.filter(item => {
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen gradient-bg text-foreground p-6 relative">
      {/* Search and Filter Section */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">PsychoEducational Hub</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Explore curated resources to support your mental wellbeing and personal growth.</p>
        <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-center max-w-2xl mx-auto">
            <div className="relative w-full md:w-2/3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input 
                    type="text"
                    placeholder="Search by title..."
                    className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
        <div className="mt-6 flex items-center justify-center flex-wrap gap-2">
            {filters.map(filter => (
                <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${
                        activeFilter === filter 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-card text-muted-foreground hover:bg-muted'
                    }`}
                >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
            ))}
        </div>
      </div>

      {/* Dynamic Content Grid */}
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {filteredData.map((item, index) => (
                <div
                    key={index}
                    className="bg-card rounded-xl shadow-sm border border-border overflow-hidden cursor-pointer group hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col"
                    onClick={() => handleCardClick(item)}
                >
                    <div className="w-full h-40 overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                        <p className="text-sm text-muted-foreground mb-1 capitalize">{item.type}</p>
                        <h3 className="text-md font-semibold text-foreground flex-grow">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                    </div>
                </div>
            ))}
        </div>
      ) : (
        <div className="text-center max-w-6xl mx-auto py-16">
            <h3 className="text-xl font-semibold">No Results Found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}

      {/* Dynamic Modal */}
      {isModalOpen && currentItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setIsModalOpen(false)}
            />
            <div className="relative z-10 w-full max-w-3xl bg-card rounded-2xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95">
                <button
                    className="absolute top-3 right-3 bg-background/50 text-foreground p-1.5 rounded-full hover:bg-muted z-20"
                    onClick={() => setIsModalOpen(false)}
                >
                    <X size={20} />
                </button>

                {currentItem.type === "video" && getYouTubeEmbedUrl(currentItem.link) ? (
                    <div className="aspect-video w-full">
                        <iframe
                            className="w-full h-full"
                            src={getYouTubeEmbedUrl(currentItem.link)}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : (
                    <div className="aspect-video w-full bg-black flex items-center justify-center p-4">
                        <a href={currentItem.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                            <Play size={18} /> Watch on Provider
                        </a>
                    </div>
                )}
                
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-2">{currentItem.title}</h2>
                    <p className="text-muted-foreground mb-4">{currentItem.description}</p>

                    {(currentItem.type === "article" || currentItem.type === "interactive" || currentItem.type === "audio") && (
                        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 mb-6">
                            <p>{currentItem.content}</p>
                        </div>
                    )}
                    
                    {(currentItem.type === "article" || currentItem.type === "interactive" || currentItem.type === "audio") && (
                        <a href={currentItem.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                            {currentItem.type === "article" && "Read Full Article"}
                            {currentItem.type === "audio" && "Listen Now"}
                            {currentItem.type === "interactive" && "Play Game"}
                        </a>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}