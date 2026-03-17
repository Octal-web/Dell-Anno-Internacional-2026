import { Reveal } from './Reveal';
import { StoreFeaturedsSlides } from './StoreFeaturedsSlides';

export const StoreFeatureds = ({ images }) => {
    return (
        <section className="pb-10 md:pb-30 mt-2 md:mt-10 2xl:mt-20">
            <div className="container max-w-large">
                <Reveal direction="bottom" scale={true}>
                    <h2 className="text-3xl text-center font-light uppercase sm:tracking-wide sm:leading-snug mb-6 md:mb-12 2xl:mb-16">Showroom - Details</h2>
                </Reveal>

                <StoreFeaturedsSlides slides={images} />
            </div>
        </section>
    );
};