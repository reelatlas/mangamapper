import { cn } from "@/lib/utils";

interface GoogleIconProps {
  className?: string;
}

const GoogleIcon = ({ className }: GoogleIconProps) => (
  <svg 
    className={cn("w-4 h-4", className)} 
    viewBox="0 0 798 798" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Top-right: Darkest → Blue */}
    <path 
      className="fill-[#404958] group-hover:fill-[#3B82F6] transition-colors duration-200" 
      d="M789.307 407.484C789.307 374.708 786.647 350.791 780.892 325.988H406.626V473.921H626.311C621.884 510.684 597.966 566.049 544.815 603.252L544.07 608.205L662.406 699.878L670.605 700.696C745.899 631.157 789.307 528.843 789.307 407.484Z" 
    />
    {/* Bottom: Dark → Dark Green */}
    <path 
      className="fill-[#4B5563] group-hover:fill-[#059669] transition-colors duration-200" 
      d="M406.626 797.252C514.253 797.252 604.608 761.817 670.605 700.696L544.815 603.252C511.154 626.727 465.976 643.114 406.626 643.114C301.212 643.114 211.743 573.579 179.85 477.466L175.176 477.863L52.1282 573.09L50.519 577.563C116.07 707.78 250.718 797.252 406.626 797.252Z" 
    />
    {/* Left: Medium → Orange */}
    <path 
      className="fill-[#6B7280] group-hover:fill-[#F97316] transition-colors duration-200" 
      d="M179.85 477.466C171.435 452.663 166.565 426.086 166.565 398.626C166.565 371.163 171.435 344.589 179.408 319.786L179.185 314.504L54.5954 217.747L50.5191 219.686C23.5023 273.722 8 334.403 8 398.626C8 462.849 23.5023 523.527 50.5191 577.563L179.85 477.466Z" 
    />
    {/* Top-left: Lightest → Red-Pink */}
    <path 
      className="fill-[#8B95A2] group-hover:fill-[#E11D48] transition-colors duration-200" 
      d="M406.626 154.134C481.478 154.134 531.969 186.467 560.76 213.487L673.261 103.643C604.168 39.4198 514.253 0 406.626 0C250.717 0 116.07 89.4687 50.519 219.685L179.408 319.786C211.743 223.673 301.212 154.134 406.626 154.134Z" 
    />
  </svg>
);

export default GoogleIcon;
