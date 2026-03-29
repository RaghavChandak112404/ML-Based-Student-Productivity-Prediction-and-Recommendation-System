import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip
} from "recharts";

export default function Insights() {
  const [data, setData] = useState({
    studyHours: 0,
    screenTime: 0,
    sleepHours: 0,
    socialMedia: "Low",
    stress: 0,
    attendance: 0,
    prediction: null as any
  });

  useEffect(() => {
    setData({
      studyHours: Number(sessionStorage.getItem("studyHours")) || 0,
      screenTime: Number(sessionStorage.getItem("screenTime")) || 0,
      sleepHours: Number(sessionStorage.getItem("sleepHours")) || 0,
      socialMedia: sessionStorage.getItem("socialMedia") || "Low",
      stress: Array.isArray(JSON.parse(sessionStorage.getItem("stress") || "[5]")) 
                ? JSON.parse(sessionStorage.getItem("stress") || "[5]")[0] : 5,
      attendance: Number(sessionStorage.getItem("attendance")) || 0,
      prediction: sessionStorage.getItem("prediction") 
                ? JSON.parse(sessionStorage.getItem("prediction")!) : null
    });
  }, []);

  if (!data.prediction && data.studyHours === 0 && data.screenTime === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">No Data Available</h2>
        <p className="text-muted-foreground max-w-md">Please navigate to the Prediction Tool to analyze your habits.</p>
      </div>
    );
  }

  // Normalize metrics to 0-100 representing positive habit strength
  const radarData = [
    { subject: "Study", value: Math.min(100, (data.studyHours / 8) * 100) },
    { subject: "Sleep", value: Math.min(100, (data.sleepHours / 8) * 100) },
    { subject: "Focus", value: data.attendance },
    { subject: "Stress Mgt.", value: (10 - data.stress) * 10 },
    { subject: "Screen Control", value: Math.max(0, 100 - (data.screenTime / 6) * 100) },
    { subject: "Social Moderation", value: data.socialMedia === "Low" ? 90 : data.socialMedia === "Medium" ? 50 : 20 },
  ];

  const confidenceValue = data.prediction ? Math.round(data.prediction.confidence) : 0;
  const confidenceData = [
    { name: "Confidence", value: confidenceValue, color: "hsl(220, 72%, 50%)" },
    { name: "Uncertainty", value: 100 - confidenceValue, color: "hsl(220, 20%, 90%)" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold gradient-text">Insights & Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep dive into your personalized productivity patterns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">Personal Habit Radar</CardTitle></CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground mb-4">Values reflect habit strength (higher is better).</p>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid className="opacity-30" />
                <PolarAngleAxis dataKey="subject" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} fontSize={10} />
                <Radar dataKey="value" stroke="hsl(265, 60%, 58%)" fill="hsl(265, 60%, 58%)" fillOpacity={0.4} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">Prediction Confidence Level</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={260} className="max-w-[260px]">
              <PieChart>
                <Pie 
                  data={confidenceData} 
                  dataKey="value" 
                  cx="50%" cy="50%" 
                  outerRadius={90} innerRadius={60} 
                  startAngle={90} endAngle={-270}
                  stroke="none"
                >
                  {confidenceData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-[-30px]">
              <span className="text-3xl font-bold gradient-text">{confidenceValue}%</span>
              <p className="text-sm text-muted-foreground">Model Certainty</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
