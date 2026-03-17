export const ManualText = ({ content, file }) => {
    return (
        <section className="mb-30">
            <div className="container max-w-medium">
                <h2 className="text-5xl font-light uppercase mt-20 mb-10">Owner's manual and Warranty Certificate</h2>
                <div className="font-secondary font-light text-center text-justify [&_ul]:mb-4 [&>ul[type='circle']]:list-disc [&>ul[type='circle']]:list-inside [&_table]:my-5 [&_th]:border [&_th]:border-black [&_th]:p-2 [&_td]:border [&_td]:border-black [&_td]:p-2" dangerouslySetInnerHTML={{ __html: content }} />

                <a href={file} className="mt-16 mx-auto block w-fit border border-neutral-800 bg-white font-light text-center uppercase p-2 min-w-40 sm:min-w-44 transition-all hover:bg-black hover:text-white" download>Download file</a>
            </div>
        </section>
    );
};