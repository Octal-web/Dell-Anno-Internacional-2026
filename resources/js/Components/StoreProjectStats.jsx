export const StoreProjectStats = ({ project }) => {
    let details = project.produtos.split(/\r?\n/);

    return (
        <section className="pt-16">
            <div className="container max-w-large">
                <div className="flex items-center flex-col md:flex-row justify-between">
                    <h2 className="text-3xl sm:text-4xl 2xl:text-[45px] font-light uppercase tracking-wide leading-snug max-md:mb-6">Products</h2>

                    <div className="flex items-center max-md:flex-wrap justify-between md:justify-end gap-4 md:gap-[10%] w-full">
                        {details.map((item) => (
                            <span className="font-secondary text-2xl 2xl:text-[32px] font-light" key={item}>{item}</span>
                        ))}

                        <div className="flex items-center">
                            <span className="font-secondary text-2xl 2xl:text-[32px] font-light">Credits</span>
                            <span className="font-secondary font-light max-w-[310px] ml-10">{project.creditos}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container max-w-x-large"><div className="border-b pt-16" /></div>

        </section>
    );
};