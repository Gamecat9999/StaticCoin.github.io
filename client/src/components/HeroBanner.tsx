import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Box } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="bg-gradient-to-r from-dark to-primary text-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover the World of BlockCoin</h1>
            <p className="text-lg mb-6">An educational cryptocurrency platform where you can learn about blockchain, try mining, and manage a virtual wallet.</p>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-accent hover:bg-opacity-90 text-white">
                <Link href="/mining">Start Mining</Link>
              </Button>
              <Button asChild variant="outline" className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white">
                <Link href="/education">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Box className="h-32 w-32 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
