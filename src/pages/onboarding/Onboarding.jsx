// /* ======================================================
//    src/pages/onboarding/Onboarding.jsx
//    Modern Multi-Step Onboarding Flow
// ====================================================== */
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   User, 
//   Briefcase, 
//   Target, 
//   Users, 
//   CheckCircle,
//   ArrowRight,
//   ArrowLeft,
//   Sparkles,
//   Clock,
//   Calendar,
//   Layout,
//   Bell
// } from "lucide-react";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { useAuthStore } from "../../store/authStore";

// // Import step components
// import ProfileSetup from "./steps/ProfileSetup";
// import WorkspaceSetup from "./steps/WorkspaceSetup";
// import PreferencesSetup from "./steps/PreferencesSetup";
// import TeamInvite from "./steps/TeamInvite";
// import Complete from "./steps/Complete";

// const ONBOARDING_STEPS = [
//   {
//     id: 1,
//     title: "Complete Your Profile",
//     description: "Tell us about yourself",
//     icon: User,
//     component: ProfileSetup,
//     step: "profileSetup",
//   },
//   {
//     id: 2,
//     title: "Set Up Workspace",
//     description: "Create your first project",
//     icon: Briefcase,
//     component: WorkspaceSetup,
//     step: "firstProject",
//   },
//   {
//     id: 3,
//     title: "Customize Preferences",
//     description: "Make FlowEase yours",
//     icon: Layout,
//     component: PreferencesSetup,
//     step: "preferences",
//   },
//   {
//     id: 4,
//     title: "Invite Your Team",
//     description: "Collaborate together",
//     icon: Users,
//     component: TeamInvite,
//     step: "inviteTeam",
//   },
//   {
//     id: 5,
//     title: "You're All Set!",
//     description: "Start managing tasks",
//     icon: CheckCircle,
//     component: Complete,
//     step: "complete",
//   },
// ];

// const Onboarding = () => {
//   const navigate = useNavigate();
//   const user = useAuthStore((state) => state.user);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [completedSteps, setCompletedSteps] = useState([]);
//   const [formData, setFormData] = useState({});

//   // Check if onboarding is already completed
//   useEffect(() => {
//     if (user?.onboarding?.isCompleted) {
//       navigate("/dashboard", { replace: true });
//     }
//   }, [user, navigate]);

//   // Get current step component
//   const CurrentStepComponent = ONBOARDING_STEPS[currentStep - 1]?.component;
//   const totalSteps = ONBOARDING_STEPS.length;
//   const progress = (currentStep / totalSteps) * 100;

//   const handleNext = (data) => {
//     // Save step data
//     setFormData((prev) => ({ ...prev, ...data }));
    
//     // Mark step as completed
//     const currentStepId = ONBOARDING_STEPS[currentStep - 1].step;
//     if (!completedSteps.includes(currentStepId)) {
//       setCompletedSteps((prev) => [...prev, currentStepId]);
//     }

//     // Move to next step
//     if (currentStep < totalSteps) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const handleSkip = () => {
//     if (currentStep < totalSteps) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const handleFinish = async () => {
//     try {
//       // Mark onboarding as complete
//       await fetch("/api/users/complete-onboarding", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           completedSteps,
//           formData,
//         }),
//       });

//       toast.success("Onboarding completed! 🎉");
//       navigate("/dashboard", { replace: true });
//     } catch (error) {
//       toast.error("Failed to complete onboarding");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-dark-bg1 via-dark-bg to-dark-bg1">
//       <div className="max-w-6xl mx-auto px-4 py-8">
        
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-2xl font-bold text-dark-text flex items-center gap-2">
//                 <Sparkles className="w-6 h-6 text-primary" />
//                 Welcome to FlowEase
//               </h1>
//               <p className="text-dark-muted mt-1">
//                 Let's get you set up in just a few steps
//               </p>
//             </div>
//             <button
//               onClick={() => navigate("/dashboard")}
//               className="text-sm text-dark-muted hover:text-dark-text transition-colors"
//             >
//               Skip for now →
//             </button>
//           </div>

//           {/* Progress Bar */}
//           <div className="relative">
//             <div className="h-2 bg-dark-bg3 rounded-full overflow-hidden">
//               <motion.div
//                 initial={{ width: 0 }}
//                 animate={{ width: `${progress}%` }}
//                 transition={{ duration: 0.5, ease: "easeOut" }}
//                 className="h-full bg-gradient-to-r from-primary to-primary-400 rounded-full"
//               />
//             </div>
//             <div className="flex justify-between mt-4">
//               {ONBOARDING_STEPS.map((step, index) => (
//                 <div
//                   key={step.id}
//                   className="flex flex-col items-center gap-2 flex-1"
//                 >
//                   <div
//                     className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
//                       currentStep > index + 1
//                         ? "bg-success text-white"
//                         : currentStep === index + 1
//                         ? "bg-primary text-white ring-4 ring-primary/20"
//                         : "bg-dark-bg3 text-dark-muted"
//                     }`}
//                   >
//                     {currentStep > index + 1 ? (
//                       <CheckCircle className="w-5 h-5" />
//                     ) : (
//                       <step.icon className="w-5 h-5" />
//                     )}
//                   </div>
//                   <span
//                     className={`text-xs font-medium hidden sm:block ${
//                       currentStep >= index + 1
//                         ? "text-dark-text"
//                         : "text-dark-muted"
//                     }`}
//                   >
//                     {step.title}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Step Content */}
//         <div className="card p-8 min-h-[500px]">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={currentStep}
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               transition={{ duration: 0.3 }}
//             >
//               {CurrentStepComponent && (
//                 <CurrentStepComponent
//                   data={formData}
//                   onNext={handleNext}
//                   onBack={handleBack}
//                   onSkip={handleSkip}
//                   onFinish={handleFinish}
//                   isFirst={currentStep === 1}
//                   isLast={currentStep === totalSteps}
//                 />
//               )}
//             </motion.div>
//           </AnimatePresence>
//         </div>

//         {/* Navigation Footer */}
//         <div className="mt-6 flex items-center justify-between">
//           <div className="text-sm text-dark-muted">
//             Step {currentStep} of {totalSteps}
//           </div>
//           <div className="flex items-center gap-2">
//             {currentStep < totalSteps && (
//               <button
//                 onClick={handleSkip}
//                 className="text-sm text-dark-muted hover:text-dark-text transition-colors"
//               >
//                 Skip this step
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Onboarding;