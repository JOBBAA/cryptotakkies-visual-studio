import { AbsoluteFill, useVideoConfig, useCurrentFrame, spring, interpolate } from 'remotion';

export type MySlideProps = {
    titleText: string;
    subtitleText: string;
    theme: 'dark' | 'light' | 'accent';
};

export const MySlide: React.FC<MySlideProps> = ({
    titleText = 'Crypto Takkies',
    subtitleText = 'Slides Template Starting',
    theme = 'dark',
}) => {
    const { width, fps } = useVideoConfig();
    const frame = useCurrentFrame();

    const bgColors = {
        dark: '#0A0A0A',
        light: '#E8F0EE',
        accent: '#2ECC71',
    };

    const textColors = {
        title: theme === 'accent' ? '#0A0A0A' : '#2ECC71',
        subtitle: theme === 'light' ? '#0A0A0A' : '#ffffff',
    };

    // Calculate title scale spring animation
    const titleScale = spring({
        fps,
        frame,
        config: {
            damping: 12,
            stiffness: 100,
            mass: 0.5,
        },
    });

    // Subtitle opacity fade-in, delayed slightly (starts at frame 15)
    const subtitleOpacity = interpolate(
        frame,
        [15, 30],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // Subtitle slide-up animation
    const subtitleY = interpolate(
        frame,
        [15, 30],
        [40, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    return (
        <AbsoluteFill
            style={{
                backgroundColor: bgColors[theme],
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                border: '8px solid rgba(255, 255, 255, 0.05)',
            }}
        >
            <h1
                style={{
                    color: textColors.title,
                    fontSize: width * 0.09,
                    fontWeight: '900',
                    margin: 0,
                    textAlign: 'center',
                    padding: '0 40px',
                    fontFamily: 'var(--font-outfit), sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '-2px',
                    lineHeight: '0.9',
                    transform: `scale(${titleScale})`,
                }}
            >
                {titleText}
            </h1>
            <h2
                style={{
                    color: textColors.subtitle,
                    fontSize: width * 0.045,
                    marginTop: 30,
                    fontWeight: '500',
                    textAlign: 'center',
                    padding: '0 40px',
                    opacity: subtitleOpacity,
                    transform: `translateY(${subtitleY}px)`,
                }}
            >
                {subtitleText}
            </h2>
        </AbsoluteFill>
    );
};
