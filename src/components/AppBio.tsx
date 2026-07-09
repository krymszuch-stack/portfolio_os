/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TimelineItem, OSConfig } from '../types';
import { BioProfileSection } from './bio/BioProfileSection';
import { BioMilestoneSection } from './bio/BioMilestoneSection';
import { BioSkillsSection } from './bio/BioSkillsSection';
import { BioSocialSection } from './bio/BioSocialSection';
import { BioPhotoStreamSection } from './bio/BioPhotoStreamSection';

interface AppBioProps {
  config: OSConfig;
  setConfig: React.Dispatch<React.SetStateAction<OSConfig>>;
  timeline: TimelineItem[];
  setTimeline: React.Dispatch<React.SetStateAction<TimelineItem[]>>;
}

export const AppBio: React.FC<AppBioProps> = ({
  config,
  setConfig,
  timeline,
  setTimeline
}) => {
  return (
    <div className="space-y-8">
      {/* Profile Header Block */}
      <BioProfileSection config={config} setConfig={setConfig} />

      {/* Grid: Career Timeline & Skill Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Timeline (Left Column) */}
        <div className="lg:col-span-7 space-y-4">
          <BioMilestoneSection timeline={timeline} setTimeline={setTimeline} />
        </div>

        {/* Skill badging taxonomy (Right Column) */}
        <div className="lg:col-span-5 space-y-5">
          <BioSkillsSection config={config} setConfig={setConfig} />
          
          {/* Social Links Block */}
          <BioSocialSection config={config} setConfig={setConfig} />
        </div>
      </div>

      {/* Linked Instagram photo stream (Fully Editable) */}
      <BioPhotoStreamSection config={config} setConfig={setConfig} />
    </div>
  );
};
