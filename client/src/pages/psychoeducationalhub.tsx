import Psychoeducational from "@/components/psychoeducational";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function PsychoeducationalHub() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Psychoeducational />
      <Footer />
    </div>
  );
}