import { Shield, HelpCircle, TrendingUp, Bot } from "lucide-react";
import { Link } from "wouter";
export default function PlatformFeatures() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-12" data-testid="platform-features-title">
          Platform Feature and Impacts
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-6">
            <Link href="/confidential"> <div className="text-center" data-testid="feature-confidential">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="text-primary text-2xl" size={32} />
              </div>
              <h3 className="font-semibold text-foreground">Confidential & Safe</h3>
            </div></Link>
            <Link href="\faq"><div className="text-center" data-testid="feature-faqs">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <HelpCircle className="text-primary text-2xl" size={32} />
              </div>
              <h3 className="font-semibold text-foreground">FAQs & Help</h3>
            </div></Link>
          </div>

          <div className="lg:col-span-2" data-testid="students-photo">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=800"
              alt="Group of diverse college students"
              className="rounded-xl shadow-lg w-full h-[290px] object-cover"
            />
          </div>

          <div className="space-y-6">
            {/*Analytics Card */}
            <div className="bg-card p-4 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow" data-testid="analytics-card">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-foreground">Understanding Students & Emotions</h4>
                <TrendingUp className="text-primary" size={20} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-3/4"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full w-1/2"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary text-white p-4 rounded-xl hover:bg-primary/90 transition-colors cursor-pointer" data-testid="chatbot-info">
              <div className="flex items-center space-x-2 mb-2">
                <Bot size={22} />
                <h4 className="font-medium">Chat with Mindy, your AI guide.</h4>
              </div>
              <p className="text-sm opacity-90">Hi there! Feeling overwhelmed? I'm here Wer of help. Just exploring.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
