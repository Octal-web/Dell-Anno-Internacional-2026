export const StoreData = ({ store }) => {
    return (
        <section className="pt-6 md:pt-10 pb-6 md:pb-14">
            <div className="container max-w-medium">
                <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="py-8 md:py-10">
                        <p className="font-secondary text-center font-bold uppercase mb-4 md:mb-10">Address:</p>
                        <p className="font-secondary text-center font-light leading-loose whitespace-pre-line">{store.endereco}</p>
                    </div>
                    
                    <div className="relative py-8 md:py-10 md:before:absolute md:before:top-0 md:before:bottom-0 md:before:w-px md:before:bg-neutral-400 md:before:left-0 border-t md:border-t-0 border-neutral-400">
                        <p className="font-secondary text-center font-bold uppercase mb-4 md:mb-10">Contacts:</p>
                        <p className="font-secondary text-center font-light leading-loose whitespace-pre-line">{store.contato}</p>
                    </div>
                    
                    <div className="relative py-8 md:py-10 md:before:absolute md:before:top-0 md:before:bottom-0 md:before:w-px md:before:bg-neutral-400 md:before:left-0 border-t md:border-t-0 border-neutral-400">
                        <p className="font-secondary text-center font-bold uppercase mb-4 md:mb-10">Hours:</p>
                        <p className="font-secondary text-center font-light leading-loose whitespace-pre-line">{store.horario_atendimento}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};