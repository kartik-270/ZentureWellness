import { useState } from "react";
import { Play, BookOpen, Headphones, X, Smile } from "lucide-react";

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
    content: "This is a placeholder for the full article content on building resilience. You can replace this text with content fetched from an API or a markdown file.",
  },
  {
    title: "Breathing Exercise",
    description: "8-min video",
    type: "video",
    link: "https://www.youtube.com/watch?v=p8oxM5j9eNE", // Another sample video link
    image: "https://www.browsewellness.com/wp-content/uploads/2023/05/group-of-young-women-practicing-yoga-morning-medi-2021-08-26-20-10-53-utc-1024x683.jpg",
  },
  {
    title: "Guided Sleep Meditation",
    description: "8-min audio",
    type: "audio",
    link: "https://insighttimer.com/rhiframe/guided-meditations/8-minute-meditation-for-a-restful-sleep", // Placeholder audio file
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
    type: "video",
    link: "https://www.youtube.com/watch?v=BjVPyzegUOQ", // Placeholder audio file
    image: "https://www.shutterstock.com/image-photo/content-creator-woman-host-streaming-260nw-2178252193.jpg",
  },
  {
    title: "Healthy Relationships 101",
    description: "5-min audio",
    type: "audio",
    link: "https://podcasts.apple.com/sa/podcast/5-minute-boost-healthy-relationship-boundaries-self-care/id1818853383?i=1000723049763&l=ar", // Placeholder audio file
    image: "https://www.mountainside.com/wp-content/uploads/2023/01/healthy-relationship-couple.jpg",
  },
  {
    title: "Mind Relaxing Games",
    type: "interactive",
    link: "https://blackgrain.itch.io/puzzle-vibes",
    image: "https://www.dispatch.com/gcdn/authoring/2020/03/12/NCOD/ghows-OH-a0a972f7-29e8-2791-e053-0100007fe6e2-1f6dbcb6.jpeg",
    content: "This is a placeholder for an interactive game. This section would typically render a game component or direct to a game page.",
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
    default:
      return <Smile className="text-primary" size={20} />;
  }
};

export default function Psychoeducational() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const handleCardClick = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.split("v=")[1];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 relative">
      {/* Search and Filter Section */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-2xl font-bold mb-4 md:mb-0">PsychoEducational Hub</h2>
          <div className="flex space-x-2">
            {/* Filter buttons can be added here */}
          </div>
        </div>
      </div>

      {/* Dynamic Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-card rounded-xl shadow-sm border border-border overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => handleCardClick(item)}
          >
            <div className="w-full h-40 bg-gray-200">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  {renderIcon(item.type)}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Modal */}
      {isModalOpen && currentItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative z-10 w-[90%] md:w-[70%] lg:w-[60%] bg-card p-6 rounded-2xl shadow-2xl transform scale-105 transition-transform">
            <button
              className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full hover:bg-black/80"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-4">{currentItem.title}</h2>
            <p className="text-muted-foreground mb-4">{currentItem.description}</p>

            {/* Conditional Rendering based on resource type */}
            {currentItem.type === "video" && (
              <div className="aspect-w-16 aspect-h-12">
                <iframe
                  className="w-full h-[350px] rounded-xl"
                  src={getYouTubeEmbedUrl(currentItem.link)}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            
            {currentItem.type === "article" && (
              <div className="prose text-sm text-foreground">
                <p>    <a href={currentItem.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Read the full article here
                  </a>
</p>
              </div>
            )}

            {currentItem.type === "audio" && (
              <audio controls className="w-full">
                <source src={currentItem.link} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}

            {currentItem.type === "interactive" && (
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center">
                <p>    
                    <a href={currentItem.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
Visit to calm your mind</a></p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}