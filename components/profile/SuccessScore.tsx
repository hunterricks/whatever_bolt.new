"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getSuccessScoreLevel, getBadgeDescription } from "@/lib/calculateSuccessScore";
import { cn } from "@/lib/utils";

interface SuccessScoreProps {
  score: number;
  badges: string[];
  className?: string;
}

export function SuccessScore({ score, badges, className }: SuccessScoreProps) {
  const { level, color, description } = getSuccessScoreLevel(score);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Success Score</span>
          <Badge variant="outline" className={`bg-${color}-50 text-${color}-700`}>
            {level}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Score</span>
            <span className="font-medium">{score}%</span>
          </div>
          <Progress value={score} className="h-2" />
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {badges.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Achievements</h4>
            <div className="flex flex-wrap gap-2">
              <TooltipProvider>
                {badges.map((badge) => (
                  <Tooltip key={badge}>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="capitalize">
                        {badge.replace('-', ' ')}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getBadgeDescription(badge)}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}