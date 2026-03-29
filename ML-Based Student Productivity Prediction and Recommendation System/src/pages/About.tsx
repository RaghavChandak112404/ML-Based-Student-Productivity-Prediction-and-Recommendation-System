import { BrainCircuit, Target, Database, LineChart, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: BrainCircuit, title: "AI-Powered Predictions", desc: "Machine learning models analyze study patterns to predict productivity levels." },
  { icon: Target, title: "Personalized Recommendations", desc: "Tailored suggestions to improve academic performance based on individual habits." },
  { icon: Database, title: "Data-Driven Insights", desc: "Comprehensive analytics dashboards visualize behavioral patterns and trends." },
  { icon: LineChart, title: "Correlation Analysis", desc: "Discover relationships between screen time, sleep, and academic output." },
  { icon: Lightbulb, title: "Actionable Intelligence", desc: "Transform raw data into practical strategies for better student outcomes." },
];

export default function About() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text">About This Project</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          An intelligent analytics platform that leverages machine learning to predict and enhance student productivity through data-driven insights.
        </p>
      </div>

      <div className="grid gap-4">
        {features.map((f, i) => (
          <Card key={i} className="glass-card hover:shadow-md transition-shadow">
            <CardContent className="flex items-start gap-4 p-5">
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card">
        <CardContent className="p-5 text-sm text-muted-foreground space-y-2">
          <h3 className="font-semibold text-foreground">How It Works</h3>
          <p>The system collects behavioral metrics — study hours, screen time, sleep patterns, social media usage, stress levels, and attendance — then runs them through a trained classification model to predict productivity as Low, Medium, or High.</p>
          <p>Based on the prediction, the engine generates personalized recommendations to help students optimize their daily routines for better academic outcomes.</p>
        </CardContent>
      </Card>
    </div>
  );
}
