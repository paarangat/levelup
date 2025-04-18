import React from 'react';
import styled from 'styled-components';
import theme from '../styles/theme';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  textSize?: string;
  showText?: boolean;
}

const RingContainer = styled.div<{ size: number }>`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
`;

const CircleText = styled.div<{ size: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: ${props => props.size};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.dark};
`;

const StyledSvg = styled.svg`
  transform: rotate(-90deg);
`;

const BackgroundCircle = styled.circle`
  fill: none;
  stroke: ${theme.colors.gray[200]};
`;

const ProgressCircle = styled.circle`
  fill: none;
  stroke: url(#progress-gradient);
  transition: stroke-dashoffset 0.35s;
  transform-origin: 50% 50%;
`;

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 64,
  strokeWidth = 4,
  textSize = '1.25rem',
  showText = true
}) => {
  const normalizedRadius = (size - strokeWidth) / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  return (
    <RingContainer size={size}>
      <StyledSvg
        height={size}
        width={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={theme.colors.primary.pink} />
            <stop offset="100%" stopColor={theme.colors.primary.blue} />
          </linearGradient>
        </defs>
        
        <BackgroundCircle
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
        
        <ProgressCircle
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference + ' ' + circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </StyledSvg>
      
      {showText && (
        <CircleText size={textSize}>
          {progress}%
        </CircleText>
      )}
    </RingContainer>
  );
};

export default ProgressRing;
