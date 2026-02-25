import { useState, useEffect } from "react";
import { Play, BookOpen, Headphones, X, Smile, Search, Gamepad2, Globe } from "lucide-react";
import { apiConfig } from "@/lib/config";

const renderIcon = (type: string) => {
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

const filters = ["all", "video", "article", "audio"];
const LANGUAGES = ["all", "English", "Hindi", "Marathi", "Bengali", "Tamil", "Telugu", "Kannada", "Malayalam"];

export default function Psychoeducational() {
    const [resources, setResources] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<any>(null);
    const [activeFilter, setActiveFilter] = useState("all");
    const [activeLanguage, setActiveLanguage] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch(`${apiConfig.baseUrl}/resources`)
            .then(res => res.json())
            .then(data => setResources(data))
            .catch(err => console.error("Failed to fetch resources", err));
    }, []);

    const handleCardClick = (item: any) => {
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    const isDirectMedia = (url: string) => {
        if (!url) return false;
        return url.startsWith('/uploads') || url.startsWith('http');
    };

    const getSourceUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith('http')) return url;
        return `${apiConfig.baseUrl}${url}`;
    };

    const getYouTubeEmbedUrl = (url: string) => {
        if (!url || !url.includes("youtube.com/watch?v=")) return undefined;
        const videoId = url.split("v=")[1].split("&")[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    };

    const filteredData = resources.filter(item => {
        const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
        const matchesLanguage = activeLanguage === 'all' || item.language === activeLanguage;
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesLanguage && matchesSearch;
    });

    const getPlaceholderImage = (type: string) => {
        switch (type) {
            case 'video': return "https://images.pexels.com/photos/1036856/pexels-photo-1036856.jpeg";
            case 'audio': return "https://www.hellomyyoga.com/blog/wp-content/uploads/2024/02/what-is-guided-meditation.webp";
            case 'article': return "https://cdn2.psychologytoday.com/assets/styles/manual_crop_3_2_600x400/public/teaser_image/blog_entry/2025-03/pexels-ivan-samkov-5676744.jpg?itok=gCTxLgRX";
            default: return "https://images.pexels.com/photos/4099238/pexels-photo-4099238.jpeg";
        }
    }

    return (
        <div className="min-h-screen gradient-bg text-foreground p-6 relative">
            <div className="max-w-6xl mx-auto mb-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">PsychoEducational Hub</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">Explore curated resources to support your mental wellbeing and personal growth.</p>

                <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-center max-w-4xl mx-auto">
                    <div className="relative w-full md:w-1/2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={searchTerm}
                            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative w-full md:w-1/3">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <select
                            value={activeLanguage}
                            onChange={(e) => setActiveLanguage(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
                        >
                            <option value="all">All Languages</option>
                            {LANGUAGES.filter(l => l !== 'all').map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-center flex-wrap gap-2">
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${activeFilter === f
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-card text-muted-foreground hover:bg-muted'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {filteredData.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {filteredData.map((item, index) => (
                        <div
                            key={index}
                            className="bg-card rounded-xl shadow-sm border border-border overflow-hidden cursor-pointer group hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col"
                            onClick={() => handleCardClick(item)}
                        >
                            <div className="w-full h-40 overflow-hidden">
                                <img
                                    src={item.url && (item.type === 'article' || item.url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) ? getSourceUrl(item.url) : getPlaceholderImage(item.type)}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        {renderIcon(item.type)}
                                        <p className="text-sm text-muted-foreground capitalize">{item.type}</p>
                                    </div>
                                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                                        {item.language || "English"}
                                    </span>
                                </div>
                                <h3 className="text-md font-semibold text-foreground flex-grow line-clamp-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
                                <p className="text-xs text-muted-foreground mt-2">{item.date} • {item.author}</p>
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

            {isModalOpen && currentItem && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative z-10 w-full max-w-3xl bg-card rounded-2xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 max-h-[90vh] overflow-y-auto">
                        <button
                            className="absolute top-3 right-3 bg-background/50 text-foreground p-1.5 rounded-full hover:bg-muted z-20"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <X size={20} />
                        </button>

                        {currentItem.type === "video" && (
                            <div className="aspect-video w-full bg-black">
                                {getYouTubeEmbedUrl(currentItem.url) ? (
                                    <iframe
                                        className="w-full h-full"
                                        src={getYouTubeEmbedUrl(currentItem.url)}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : isDirectMedia(currentItem.url) ? (
                                    <video controls className="w-full h-full" src={getSourceUrl(currentItem.url)} />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-white">Video unavailable</div>
                                )}
                            </div>
                        )}

                        {currentItem.type === "audio" && (
                            <div className="w-full bg-muted p-8 flex flex-col items-center justify-center">
                                <Headphones size={48} className="mb-4 text-primary" />
                                {isDirectMedia(currentItem.url) ? (
                                    <audio controls className="w-full max-w-md" src={getSourceUrl(currentItem.url)} />
                                ) : (
                                    <a href={currentItem.url} target="_blank" className="text-blue-500 underline">Listen External Audio</a>
                                )}
                            </div>
                        )}

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-xl font-bold">{currentItem.title}</h2>
                                <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-semibold">
                                    {currentItem.language || "English"}
                                </span>
                            </div>
                            <p className="text-muted-foreground mb-4">{currentItem.description}</p>

                            {currentItem.type === "article" && currentItem.url && item_is_image(currentItem.url) && (
                                <div className="mb-6 rounded-xl overflow-hidden shadow-sm">
                                    <img src={getSourceUrl(currentItem.url)} alt="Header" className="w-full max-h-80 object-cover" />
                                </div>
                            )}

                            {currentItem.content && (
                                <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 mb-6 whitespace-pre-wrap">
                                    {currentItem.content}
                                </div>
                            )}

                            {currentItem.type === "article" && currentItem.url && !item_is_image(currentItem.url) && (
                                <a href={currentItem.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                                    <BookOpen size={18} /> Read Full Document
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const item_is_image = (url: string) => {
    return url && !!url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);
};