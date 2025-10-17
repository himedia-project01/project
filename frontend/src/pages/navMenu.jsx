import React, { useState } from "react";

export default function NavMenu() {
    const [openMenu, setOpenMenu] = useState(null);

    const menuData = {
        전체: {
            추천: ["실시간", "공지사항"],
            일반: ["연애/상담", "공부"],
            스포츠: ["운동/헬스"],
            문화: ["음식/맛집", "여행", "독서/서적"],
        },
        HOT: {
        인기: ["오늘의 HOT", "주간 인기글", "베스트 댓글"],
        },
        일반: {
        자유: ["자유게시판", "고민상담", "정보공유", "취미게시판"],
        },
        스포츠: {
        종목별: ["헬스"],
        },
        문화: {
        예술: ["영화/드라마", "음악", "만화/애니"],
        },
    };

    return (
        <nav className="relative bg-black text-white font-semibold text-sm">
        <ul className="flex justify-center gap-10 py-3">
            {Object.keys(menuData).map((category) => (
            <li
                key={category}
                className="relative"
                onMouseEnter={() => setOpenMenu(category)}
                onMouseLeave={() => setOpenMenu(null)}
            >
                <button className="hover:text-yellow-400 transition">{category}</button>

                {/* Dropdown */}
                {openMenu === category && (
                <div className="absolute left-0 top-full bg-white text-black shadow-lg rounded-b-xl mt-2 w-[800px] p-6 grid grid-cols-4 gap-6 z-50">
                    {Object.entries(menuData[category]).map(([section, items]) => (
                    <div key={section}>
                        <h3 className="font-bold text-gray-700 mb-2 border-b pb-1">{section}</h3>
                        <ul className="space-y-1 text-sm">
                        {items.map((item) => (
                            <li
                            key={item}
                            className="hover:text-red-500 cursor-pointer transition"
                            >
                            {item}
                            </li>
                        ))}
                        </ul>
                    </div>
                    ))}
                </div>
                )}
            </li>
            ))}
        </ul>
        </nav>
    );
}