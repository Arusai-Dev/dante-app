
export default function SetDescription({currentSet}) {

    return (

        <div className="
            mt-3 relative bg-[#D9D9D9]/3 rounded-[10px] gap-2 w-[calc(100vw-20px)] flex
            flex-col-reverse md:flex-row md:justify-between
            max-w-[400px] md:max-w-[1150px]
            h-fit py-3 px-4
        ">
            <div className="flex flex-col justify-between h-full gap-3 md:gap-3">
                <div>
                    <h2 className="font-bold text-[14px] md:text-[18px] truncate">{currentSet.title == null ? "No set selected..." : currentSet.title}</h2>
                    <p className="text-[12px] md:text-[14px]">{currentSet.title == "" ? '' : currentSet.description}</p>
                </div>
                {currentSet.description && (
                    <div>
                        <p className="text-[12px] md:text-[14px]">{currentSet.card_cnt} Cards</p>
                    </div>
                )}
            </div>
        </div>

    )
}