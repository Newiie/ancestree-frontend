"use client"
import React, { useState, useRef, useEffect } from 'react'

const Terms = () => {
  const [hasRead, setHasRead] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [minimize, setMinimize] = useState(false);
  const termsRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (termsRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = termsRef.current;
      const isAtBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
      if (isAtBottom) {
        setHasRead(true);
      }
    }
  };

  const handleAccept = () => {
    setHasAccepted(true);
    setMinimize(true);
  };

  const handleMinimize = () => {
    setMinimize(true);
  };

  return (
    <div className={`absolute z-20 ${minimize ? 'hidden' : 'block'} top-0 left-0 w-full bg-black/20 h-full flex justify-center items-center overflow-auto py-8`}>
        <div className="bg-[#D9E4D4] w-[90%] md:w-4/5 lg:max-w-3xl mx-auto p-4 md:p-6 rounded-lg">
        <h4 className="text-xl md:text-2xl font-semibold mb-4 text-center">AncesTREE: TERMS AND CONDITIONS</h4>
        <div 
            ref={termsRef}
            onScroll={handleScroll}
            className="h-[300px] md:h-[400px] bg-white overflow-y-auto border border-gray-200 rounded-lg mx-2 md:mx-8 px-4 md:px-8 py-4 mb-4 space-y-4 md:space-y-6"
        >
            <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">INTRODUCTION AND ACCEPTANCE</h2>
                <p className="text-gray-600 leading-relaxed">
                    These Terms and Conditions (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) and AncesTREE (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), governing your use of the AncesTREE platform and services for genealogical research and family history exploration.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">DEFINITIONS</h2>
                <div className="space-y-2 text-gray-600">
                    <p><span className="font-semibold">2.1</span> &quot;Service&quot; refers to the AncesTREE platform, including all features, tools, and content.</p>
                    <p><span className="font-semibold">2.2</span> &quot;User Content&quot; means information, data, text, photographs, and other materials submitted by users.</p>
                    <p><span className="font-semibold">2.3</span> &quot;Family Data&quot; refers to genealogical information, family trees, and related content.</p>
                    <p><span className="font-semibold">2.4</span> &quot;Platform&quot; means the AncesTREE website, mobile applications, and related services.</p>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">ACCOUNT REGISTRATION AND ELIGIBILITY</h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">3.1 Age Requirements</h3>
                        <ul className="list-disc pl-5 text-gray-600 space-y-1">
                            <li>Users must be at least 18 years old to create an account</li>
                            <li>Users between 13-17 years may only use the service with parental/guardian consent</li>
                            <li>Users under 13 are prohibited from using the service</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">3.2 Account Creation</h3>
                        <ul className="list-disc pl-5 text-gray-600 space-y-1">
                            <li>Provide accurate, current, and complete information</li>
                            <li>Maintain and update account information</li>
                            <li>One account per user unless explicitly authorized</li>
                            <li>Responsibility for maintaining account security</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">PRIVACY AND DATA PROTECTION</h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">4.1 Data Collection and Use</h3>
                        <ul className="list-disc pl-5 text-gray-600 space-y-1">
                            <li>Collection of personal information as outlined in Privacy Policy</li>
                            <li>Processing of genealogical data and family history information</li>
                            <li>Use of cookies and tracking technologies</li>
                            <li>Third-party service providers and data processors</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">4.2 Data Security</h3>
                        <ul className="list-disc pl-5 text-gray-600 space-y-1">
                            <li>Implementation of industry-standard security measures</li>
                            <li>Encryption of sensitive information</li>
                            <li>Regular security audits and updates</li>
                            <li>Breach notification procedures</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">USER RESPONSIBILITIES AND CONDUCT</h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">5.1 Acceptable Use</h3>
                        <ul className="list-disc pl-5 text-gray-600 space-y-1">
                            <li>Comply with all applicable laws and regulations</li>
                            <li>Respect intellectual property rights</li>
                            <li>Maintain accuracy in genealogical submissions</li>
                            <li>Verify information before sharing</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">5.2 Prohibited Activities</h3>
                        <ul className="list-disc pl-5 text-gray-600 space-y-1">
                            <li>Submission of false or misleading information</li>
                            <li>Harassment or abuse of other users</li>
                            <li>Unauthorized commercial use</li>
                            <li>Attempts to compromise system security</li>
                            <li>Distribution of malware or harmful code</li>
                            <li>Scraping or automated data collection</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-bold text-gray-800 mb-3">CONTACT INFORMATION</h2>
                <div className="text-gray-600 space-y-2">
                    <p className="font-semibold">For questions about these Terms:</p>
                    <p>Email: <span className="text-blue-600">legal@ancestree.com</span></p>
                    <p>Address: Cebu Institute of Technology-University, N. Bacalso Avenue, Cebu City</p>
                    <p>Phone: +63 123 456 7890</p>
                    <p className="mt-4 text-sm text-gray-500">Last Updated: December 28, 2024</p>
                </div>
            </section>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 px-4">
            <button
                disabled={!hasRead}
                onClick={handleAccept}
                className={`w-full md:w-auto px-4 py-2 rounded-lg text-sm md:text-base ${
                    hasRead 
                    ? 'bg-primary text-white hover:bg-primary/50 transition-colors duration-300' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
                I Agree to Terms & Conditions
            </button>
            {!hasRead && (
                <p className="text-xs md:text-sm text-gray-500 text-center mt-2">
                    Please read the terms and conditions to the end
                </p>
            )}
        </div>
        </div>
    </div>
  );
}

export default Terms