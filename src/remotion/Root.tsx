import { Composition } from 'remotion';
import { MySlide } from './MySlide';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="SlideTemplate"
                component={MySlide}
                durationInFrames={150}
                fps={30}
                width={1080}
                height={1080}
                defaultProps={{
                    titleText: 'Crypto Takkies',
                    subtitleText: 'Slides Template Starting',
                    theme: 'dark' as const,
                }}
            />
        </>
    );
};
