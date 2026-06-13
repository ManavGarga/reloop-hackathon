import React from "react";
import { useParams } from "react-router-dom";
import { ReturnProvider, useReturn } from "../context/ReturnContext";
import ProgressBar from "../components/shared/ProgressBar";

// Import step components
import Step1ProductSelect from "../components/return/Step1ProductSelect";
import Step2ConditionCheck from "../components/return/Step2ConditionCheck";
import Step3ValueAssessment from "../components/return/Step3ValueAssessment";
import Step4DropoffSelect from "../components/return/Step4DropoffSelect";
import Step5ReLoopOptions from "../components/return/Step5ReLoopOptions";
import Step6Confirmation from "../components/return/Step6Confirmation";

function ReturnFlowContainer() {
  const { productId } = useParams();
  const { returnDetails, updateReturn } = useReturn();
  const currentStep = returnDetails.currentStep;

  const handleNextStep = () => {
    updateReturn({ currentStep: currentStep + 1 });
  };

  const handleBackStep = () => {
    updateReturn({ currentStep: Math.max(1, currentStep - 1) });
  };

  const renderActiveStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ProductSelect preselectedId={productId} onNext={handleNextStep} />;
      case 2:
        return <Step2ConditionCheck onNext={handleNextStep} onBack={handleBackStep} />;
      case 3:
        return <Step3ValueAssessment onNext={handleNextStep} />;
      case 4:
        return <Step4DropoffSelect onNext={handleNextStep} onBack={handleBackStep} />;
      case 5:
        return <Step5ReLoopOptions onNext={handleNextStep} onBack={handleBackStep} />;
      case 6:
        return <Step6Confirmation />;
      default:
        return <Step1ProductSelect preselectedId={productId} onNext={handleNextStep} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-8 px-4 max-w-5xl mx-auto space-y-6">
      
      {/* Wizard Header Title */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight leading-tight gradient-text">
          ReLoop Smart Return Flow
        </h1>
        <p className="text-xs text-slate-400">Reduce carbon waste, earn green credits, and circularize returns.</p>
      </div>

      {/* Progress Bar */}
      <ProgressBar currentStep={currentStep} />

      {/* Step Container Card */}
      <div className="w-full bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
        {renderActiveStep()}
      </div>
    </div>
  );
}

export default function ReturnFlow() {
  return (
    <ReturnProvider>
      <ReturnFlowContainer />
    </ReturnProvider>
  );
}
