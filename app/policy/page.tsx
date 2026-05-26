export default function PolicyPage() {
    return (
        <div className="min-h-screen bg-bg text-white overflow-scroll max-h-screen -mx-36 px-36">
            <div className="border-b border-white/10 py-4 flex items-center gap-4 -mx-36 px-36">
                <a
                    href="/"
                    className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back
                </a>
                <span className="text-white/20">|</span>
                <span className="text-sm font-medium">Privacy Policy</span>
            </div>

            <div className="max-w-2xl mx-auto px-6 py-16">
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-8 bg-red-500 rounded-full" />
                        <h1 className="text-2xl font-semibold tracking-tight">Privacy Policy</h1>
                    </div>
                    <p className="text-white/40 text-sm ml-4">Last updated: May 2026</p>
                </div>

                <div className="space-y-10 ml-4">

                    <section>
                        <h2 className="text-sm font-medium text-white/50 uppercase tracking-widest mb-4">
                            Overview
                        </h2>
                        <p className="text-white/75 leading-relaxed text-[15px]">
                            We keep it simple. This app lets F1 fans rate drivers and leave comments after races.
                            That's the only data we collect — nothing more.
                        </p>
                    </section>

                    <div className="border-t border-white/8" />

                    <section>
                        <h2 className="text-sm font-medium text-white/50 uppercase tracking-widest mb-4">
                            What we collect
                        </h2>
                        <div className="space-y-3">
                            {[
                                {
                                    label: "Driver and race ratings",
                                    description: "The numerical scores you submit after each race.",
                                },
                                {
                                    label: "Comments",
                                    description: "Any positive or negative comments you leave on driver profiles.",
                                },
                                {
                                    label: "Account info",
                                    description: "Basic profile info from your Google account (name and email) used to identify your submissions.",
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="flex gap-4 p-4 rounded-lg bg-white/3 border border-white/6"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-white/90 mb-0.5">{item.label}</p>
                                        <p className="text-sm text-white/45">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="border-t border-white/8" />

                    <section>
                        <h2 className="text-sm font-medium text-white/50 uppercase tracking-widest mb-4">
                            What we don't collect
                        </h2>
                        <p className="text-white/75 leading-relaxed text-[15px]">
                            We don't track your browsing behaviour, sell your data to third parties, use
                            advertising cookies, or collect any information beyond what's listed above. Browsing
                            the app without an account leaves no trace.
                        </p>
                    </section>

                    <div className="border-t border-white/8" />

                    <section>
                        <h2 className="text-sm font-medium text-white/50 uppercase tracking-widest mb-4">
                            How we use it
                        </h2>
                        <p className="text-white/75 leading-relaxed text-[15px]">
                            Your ratings and comments are used solely to display fan sentiment on driver profiles
                            and leaderboards within the app. Your account details are used only to attribute
                            your submissions to you and to let you edit or delete them.
                        </p>
                    </section>

                    <div className="border-t border-white/8" />

                    <section>
                        <h2 className="text-sm font-medium text-white/50 uppercase tracking-widest mb-4">
                            Your rights
                        </h2>
                        <p className="text-white/75 leading-relaxed text-[15px]">
                            You can delete your account and all associated data at any time from your account
                            settings. If you have any questions or requests regarding your data, reach out to us
                            directly.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}
