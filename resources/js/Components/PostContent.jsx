export const PostContent = ({ post }) => {
    return (
        <section className="py-16 md:py-24 2xl:py-30">
            <div className="container max-w-large">
                <div className="[&_img]:h-auto" dangerouslySetInnerHTML={{ __html: post.conteudo }} />
            </div>
        </section>
    );
};