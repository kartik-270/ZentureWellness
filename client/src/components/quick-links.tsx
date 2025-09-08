import { BookOpen, Calendar, Heart, Bot } from "lucide-react";

export default function QuickLinks() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-12" data-testid="quick-links-title">
          Quick Links
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Psychoeducational Hub */}
          <div 
            className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            data-testid="card-psychoeducational-hub"
          >
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
              <BookOpen className="text-primary text-xl group-hover:scale-110 transition-transform" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Psychoeducational Hub</h3>
            <p className="text-muted-foreground">Explore articles, videos & audio for a healthier mind</p>
          </div>

          {/* Book a Session */}
          <div 
            className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            data-testid="card-book-session"
          >
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
              <Calendar className="text-primary text-xl group-hover:scale-110 transition-transform" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Book a Session</h3>
            <p className="text-muted-foreground">Connect with a campus counselor</p>
          </div>

          {/* Peer Support */}
          <div 
            className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            data-testid="card-peer-support"
          >
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
              <Heart className="text-primary text-xl group-hover:scale-110 transition-transform" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Peer Support</h3>
            <p className="text-muted-foreground">Share & connect with fellow students</p>
          </div>

          {/* AI Chat Widget */}
          <div 
            className="bg-primary/10 p-6 rounded-xl border-2 border-primary/20 hover:bg-primary/15 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            data-testid="ai-chat-widget"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Zenture Ai</h3>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg text-sm">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Bot size={14} className="text-white" />
                  </div>
                  <span className="font-medium">AI</span>
                </div>
                <p className="text-muted-foreground">I Feel Depressed. What can I do?</p>
              </div>
              <div className="bg-primary text-white p-3 rounded-lg text-sm">
                Chat with Mindy, your AI guide.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
