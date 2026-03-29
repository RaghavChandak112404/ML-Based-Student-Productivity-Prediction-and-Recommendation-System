import { useState, useEffect } from "react";
import { BookOpen, Monitor, Moon, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

interface Prediction {
  level: "Low" | "Medium" | "High";
  confidence: number;
}

export default function Dashboard() {
  const [data, setData] = useState({
    studyHours: 0,
    screenTime: 0,
    sleepHours: 0,
    stress: 0,
    attendance: 0,
    prediction: null as Prediction | null,
  });

  useEffect(() => {
    const studyHours = Number(sessionStorage.getItem("studyHours")) || 0;
    const screenTime = Number(sessionStorage.getItem("screenTime")) || 0;
    const sleepHours = Number(sessionStorage.getItem("sleepHours")) || 0;
    const stressArr = JSON.parse(sessionStorage.getItem("stress") || "[5]");
    const stress = Array.isArray(stressArr) ? stressArr[0] : 5;
    const attendance = Number(sessionStorage.getItem("attendance")) || 0;
    const predStr = sessionStorage.getItem("prediction");
    const prediction = predStr ? JSON.parse(predStr) : null;
    
    setData({ studyHours, screenTime, sleepHours, stress, attendance, prediction });
  }, []);

  if (!data.prediction && data.studyHours === 0 && data.screenTime === 0 && data.sleepHours === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">No Data Available</h2>
        <p className="text-muted-foreground max-w-md">Please navigate to the Prediction Tool and calculate your productivity level first.</p>
      </div>
    );
  }

  const timeData = [
    { name: "Study", hours: data.studyHours, fill: "hsl(220, 72%, 50%)" },
    { name: "Screen", hours: data.screenTime, fill: "hsl(10, 70%, 55%)" },
    { name: "Sleep", hours: data.sleepHours, fill: "hsl(265, 60%, 58%)" },
  ];

  const statData = [
    { name: "Stress Level", value: data.stress * 10, fill: "hsl(330, 70%, 55%)" }, // scaled out of 100 for visual tracking
    { name: "Attendance", value: data.attendance, fill: "hsl(170, 60%, 45%)" },
  ];
  
  const getLevelColor = (level?: string) => {
    if (level === "High") return "success";
    if (level === "Medium") return "warning";
    return "destructive";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold gradient-text">AI Student Productivity Analyzer</h1>
        <p className="text-muted-foreground mt-1">Real-time analysis based on your current inputs</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Study Hours" value={`${data.studyHours}h`} subtitle="Current Input" icon={BookOpen} color="primary" />
        <StatCard title="Screen Time" value={`${data.screenTime}h`} subtitle="Current Input" icon={Monitor} color={data.screenTime > 4 ? "destructive" : "warning"} />
        <StatCard title="Sleep Quality" value={`${data.sleepHours}h`} subtitle="Current Input" icon={Moon} color={data.sleepHours >= 7 ? "success" : "secondary"} />
        <StatCard title="Productivity" value={data.prediction?.level || "N/A"} subtitle={data.prediction ? `${Math.round(data.prediction.confidence)}% Confidence` : "Pending"} icon={TrendingUp} color={getLevelColor(data.prediction?.level)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Current Time Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={timeData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="opacity-30" />
                <XAxis type="number" unit="h" fontSize={12} />
                <YAxis dataKey="name" type="category" fontSize={12} width={60} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="hours" radius={[0, 4, 4, 0]}>
                  {timeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Habit Metrics (0 - 100)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={statData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="opacity-30" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis domain={[0, 100]} fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {statData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
