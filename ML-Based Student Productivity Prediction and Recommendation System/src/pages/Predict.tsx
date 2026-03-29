import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Monitor, Moon, BookOpen, Clock, Activity, GraduationCap, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface Prediction {
  level: "Low" | "Medium" | "High";
  confidence: number;
  recommendations: string[];
}

const levelColors = { Low: "text-destructive", Medium: "text-warning", High: "text-success" };
const levelBg = { Low: "bg-destructive/10", Medium: "bg-warning/10", High: "bg-success/10" };

const getColor = (text: string) => {
  if (text.includes("Great habits")) return "text-success";
  if (text.includes("screen time")) return "text-warning";
  if (text.includes("sleep")) return "text-info";
  if (text.includes("study")) return "text-primary";
  if (text.includes("stress")) return "text-accent";
  if (text.includes("social media")) return "text-destructive";
  if (text.includes("attendance")) return "text-secondary";
  return "text-muted-foreground";
};

const getIcon = (text: string) => {
  if (text.toLowerCase().includes("screen time")) return Monitor;
  if (text.toLowerCase().includes("sleep")) return Moon;
  if (text.toLowerCase().includes("study consistency")) return BookOpen;
  if (text.toLowerCase().includes("social media")) return Clock;
  if (text.toLowerCase().includes("multitasking")) return BrainCircuit;
  if (text.toLowerCase().includes("stress management")) return Activity;
  if (text.toLowerCase().includes("attendance")) return GraduationCap;
  return Sparkles; 
};

export default function Predict() {
  const [studyHours, setStudyHours] = useState(() => sessionStorage.getItem("studyHours") || "");
  const [screenTime, setScreenTime] = useState(() => sessionStorage.getItem("screenTime") || "");
  const [sleepHours, setSleepHours] = useState(() => sessionStorage.getItem("sleepHours") || "");
  const [socialMedia, setSocialMedia] = useState(() => sessionStorage.getItem("socialMedia") || "");
  const [multitasking, setMultitasking] = useState(() => sessionStorage.getItem("multitasking") || "");
  const [stress, setStress] = useState(() => JSON.parse(sessionStorage.getItem("stress") || "[5]"));
  const [attendance, setAttendance] = useState(() => sessionStorage.getItem("attendance") || "");
  const [prediction, setPrediction] = useState<Prediction | null>(() => {
    const saved = sessionStorage.getItem("prediction");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    sessionStorage.setItem("studyHours", studyHours);
    sessionStorage.setItem("screenTime", screenTime);
    sessionStorage.setItem("sleepHours", sleepHours);
    sessionStorage.setItem("socialMedia", socialMedia);
    sessionStorage.setItem("multitasking", multitasking);
    sessionStorage.setItem("attendance", attendance);
    sessionStorage.setItem("stress", JSON.stringify(stress));
    sessionStorage.setItem("prediction", prediction ? JSON.stringify(prediction) : "");
  }, [studyHours, screenTime, sleepHours, socialMedia, multitasking, attendance, stress, prediction]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    if (!studyHours || !screenTime || !sleepHours || !socialMedia || !multitasking || !attendance) {
      setError("Please fill in all fields.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("https://ml-based-student-productivity-prediction.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          study_hours: +studyHours,
          screen_time: +screenTime,
          sleep_hours: +sleepHours,
          social_media_usage: socialMedia,
          multitasking: multitasking,
          stress_level: stress[0],
          attendance: +attendance,
        })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch prediction");
      }

      const data = await response.json();

      setPrediction({
        level: data.productivity_level as "Low" | "Medium" | "High",
        confidence: data.confidence_score,
        recommendations: data.recommendations
      });
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text">Prediction Tool</h1>
        <p className="text-muted-foreground">Enter your study habits to predict your productivity level</p>
      </div>

      <Card className="glass-card">
        <CardContent className="pt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm"><BookOpen className="h-3.5 w-3.5 text-primary" />Study Hours per Day</Label>
              <Input type="number" placeholder="e.g. 4" min={0} max={16} value={studyHours} onChange={(e) => setStudyHours(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm"><Monitor className="h-3.5 w-3.5 text-warning" />Screen Time per Day</Label>
              <Input type="number" placeholder="e.g. 3" min={0} max={16} value={screenTime} onChange={(e) => setScreenTime(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm"><Moon className="h-3.5 w-3.5 text-info" />Sleep Hours per Night</Label>
              <Input type="number" placeholder="e.g. 7" min={0} max={14} value={sleepHours} onChange={(e) => setSleepHours(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm"><GraduationCap className="h-3.5 w-3.5 text-secondary" />Attendance %</Label>
              <Input type="number" placeholder="e.g. 85" min={0} max={100} value={attendance} onChange={(e) => setAttendance(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Social Media Usage</Label>
              <Select value={socialMedia} onValueChange={setSocialMedia}>
                <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Multitasking Habit</Label>
              <Select value={multitasking} onValueChange={setMultitasking}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2"><Activity className="h-3.5 w-3.5 text-accent" />Stress Level</span>
              <span className="font-semibold text-accent">{stress[0]}/10</span>
            </Label>
            <Slider min={1} max={10} step={1} value={stress} onValueChange={setStress} className="py-1" />
          </div>

          {error && <p className="text-destructive text-sm font-semibold">{error}</p>}
          <Button onClick={handlePredict} disabled={loading} className="w-full gradient-primary text-primary-foreground font-semibold h-11 text-base">
            <BrainCircuit className="mr-2 h-4 w-4" /> {loading ? "Predicting..." : "Predict Productivity"}
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {prediction && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <Card className="glass-card overflow-hidden">
              <div className="gradient-primary p-4 flex items-center justify-between">
                <h3 className="font-bold text-primary-foreground">Prediction Results</h3>
                <Sparkles className="h-5 w-5 text-primary-foreground/80" />
              </div>
              <CardContent className="pt-5 space-y-5">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className={`flex-1 rounded-xl p-4 text-center ${levelBg[prediction.level]}`}>
                    <p className="text-xs text-muted-foreground mb-1">Predicted Productivity</p>
                    <p className={`text-3xl font-extrabold ${levelColors[prediction.level]}`}>{prediction.level}</p>
                  </div>
                  <div className="flex-1 rounded-xl p-4 text-center bg-primary/10">
                    <p className="text-xs text-muted-foreground mb-1">Confidence Score</p>
                    <p className="text-3xl font-extrabold text-primary">{prediction.confidence}%</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-sm">Personalized Recommendations</h4>
                  <div className="grid gap-2.5">
                    {prediction.recommendations.map((recText, i) => {
                      const Icon = getIcon(recText);
                      const color = getColor(recText);
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/30"
                        >
                          <Icon className={`h-4 w-4 flex-shrink-0 ${color}`} />
                          <span className="text-sm">{recText}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
