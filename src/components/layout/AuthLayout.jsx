import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Users, Zap } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  const features = [
    {
      icon: Clock,
      text: 'Advanced time tracking with visual timeline',
    },
    {
      icon: CheckCircle2,
      text: 'Smart task management & dependencies',
    },
    {
      icon: Users,
      text: 'Real-time team collaboration',
    },
    {
      icon: Zap,
      text: 'Powerful automations & integrations',
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration & Features */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-dark-bg2 via-dark-bg3 to-dark-bg2 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow delay-700" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow delay-1000" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center glow-primary">
              <Clock className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-display font-bold text-gradient">FlowEase</span>
          </div>
          

          {/* Centered Illustration */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              {/* Main Circle */}
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="w-80 h-80 rounded-full border-2 border-primary/20 flex items-center justify-center"
              >
                {/* Inner Circle */}
                <motion.div
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="w-64 h-64 rounded-full border-2 border-primary/30 flex items-center justify-center"
                >
                  {/* Clock Icon */}
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center glow-primary">
                    <Clock className="w-20 h-20 text-white" strokeWidth={1.5} />
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [-10, 10, -10],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -top-6 -right-6 w-16 h-16 rounded-xl bg-dark-bg2 border border-primary/30 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [10, -10, 10],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                  className="absolute -bottom-6 -left-6 w-16 h-16 rounded-xl bg-dark-bg2 border border-primary/30 flex items-center justify-center"
                >
                  <Users className="w-8 h-8 text-info" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [-8, 8, -8],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                  }}
                  className="absolute top-1/2 -right-8 w-12 h-12 rounded-lg bg-dark-bg2 border border-primary/30 flex items-center justify-center"
                >
                  <Zap className="w-6 h-6 text-warning" />
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-3 text-dark-muted"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-dark-bg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center glow-primary">
              <Clock className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-display font-bold text-gradient">FlowEase</span>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-dark-text mb-2">
              {title}
            </h1>
            <p className="text-dark-muted">{subtitle}</p>
          </div>

          {/* Form Content */}
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;