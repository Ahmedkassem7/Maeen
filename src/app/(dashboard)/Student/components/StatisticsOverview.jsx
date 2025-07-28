import { Card, CardContent } from "@/app/_component/ui/Card";
import React, { useState } from "react";
import Toast from "../../../_component/shared/toast/Toast";
// import "../student-dashboard.css";

export default function StatisticsOverview({ stats }) {
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "info",
    duration: 2000,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card
            key={index}
            className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Decorative corner element */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-600/10 to-transparent rounded-bl-full"></div>

            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2 opacity-80">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-1">
                    {stat.value || 0}
                  </p>
                  <p
                    className={`text-sm font-semibold ${stat.color} opacity-90`}
                  >
                    {stat.change}
                  </p>
                </div>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 w-12 h-12 bg-blue-400/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="mt-4 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                <div
                  className="h-full progress-bar rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min((stat.value || 0) * 10, 100)}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      <Toast
        show={toastState.show}
        message={toastState.message}
        type={toastState.type}
        duration={toastState.duration}
        onClose={() => setToastState((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}
