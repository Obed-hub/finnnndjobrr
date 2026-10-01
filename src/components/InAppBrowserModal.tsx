import React from 'react';
import { ApplyIntelligenceModal } from './ApplyIntelligenceModal';

// Re-export ApplyIntelligenceModal for backward compatibility
export const InAppBrowserModal: React.FC = () => {
  return <ApplyIntelligenceModal />;
};

export default InAppBrowserModal;
