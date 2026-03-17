export const StoreStreetView = ({ link }) => {
    return (
        <section className="pt-12 2xl:pt-16 mb-4">
            <div className="container max-w-large">
                <div className="[&_iframe]:w-full [&_iframe]:h-auto [&_iframe]:max-h-[85vh] max-md:-mx-[5vw] [&_iframe]:aspect-video" dangerouslySetInnerHTML={{ __html: link }} />
            </div>
        </section>
    );
};