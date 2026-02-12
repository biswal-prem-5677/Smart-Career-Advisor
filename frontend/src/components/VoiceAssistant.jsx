import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, Loader2 } from 'lucide-react';
import { RetellWebClient } from 'retell-client-js-sdk';
import axios from 'axios';

// Initialize client outside component to persist across re-renders
const retellClient = new RetellWebClient();

const VoiceAssistant = () => {
    const [isCallActive, setIsCallActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [agentState, setAgentState] = useState('idle'); // idle, listening, speaking

    useEffect(() => {
        // Event Listeners for Retell Client
        retellClient.on('call_started', () => {
            console.log('Call started');
            setIsCallActive(true);
            setIsLoading(false);
        });

        retellClient.on('call_ended', () => {
            console.log('Call ended');
            setIsCallActive(false);
            setIsLoading(false);
            setAgentState('idle');
        });

        retellClient.on('agent_start_talking', () => {
            setAgentState('speaking');
        });

        retellClient.on('agent_stop_talking', () => {
            setAgentState('listening');
        });

        retellClient.on('error', (error) => {
            console.error('An error occurred:', error);
            setIsCallActive(false);
            setIsLoading(false);
            retellClient.stopCall();
        });

        return () => {
            retellClient.stopCall();
        };
    }, []);

    const toggleCall = async () => {
        if (isCallActive) {
            retellClient.stopCall();
            setIsCallActive(false);
        } else {
            setIsLoading(true);
            try {
                // 1. Get Access Token from our Backend
                const response = await axios.post(`/api/create-web-call`);
                const accessToken = response.data.access_token;

                // 2. Start Call with Retell SDK
                await retellClient.startCall({
                    accessToken: accessToken,
                });

            } catch (error) {
                console.error("Failed to start call:", error);
                setIsLoading(false);
                alert("Failed to connect to AI Assistant. Please check console.");
            }
        }
    };

    return (
        <div className="fixed bottom-8 left-8 z-50 flex items-center gap-4">

            {/* Tooltip / Status Bubble */}
            <div className={`
                bg-white px-4 py-2 rounded-2xl shadow-lg border border-slate-100 transition-all duration-500 origin-left
                ${isCallActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none absolute left-20'}
            `}>
                <div className="flex items-center gap-2">
                    {agentState === 'speaking' && (
                        <div className="flex gap-1 h-3 items-center">
                            <span className="w-1 bg-indigo-500 h-full animate-pulse-fast"></span>
                            <span className="w-1 bg-indigo-500 h-2/3 animate-pulse-fast delay-75"></span>
                            <span className="w-1 bg-indigo-500 h-full animate-pulse-fast delay-150"></span>
                        </div>
                    )}
                    <span className="text-sm font-bold text-slate-700">
                        {agentState === 'speaking' ? 'Agent Speaking...' : 'Listening...'}
                    </span>
                </div>
            </div>

            {/* Main Button */}
            <button
                onClick={toggleCall}
                className={`
                    relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500
                    ${isCallActive
                        ? 'bg-rose-500 hover:bg-rose-600 rotate-0'
                        : 'bg-slate-900 hover:bg-slate-800 hover:scale-110'
                    }
                `}
            >
                {/* Ripple Effect when Active */}
                {isCallActive && (
                    <>
                        <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping"></span>
                        <span className="absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-20 animate-pulse delay-75 scale-125"></span>
                    </>
                )}

                {/* Idle Pulse */}
                {!isCallActive && !isLoading && (
                    <span className="absolute -inset-1 bg-indigo-500/20 rounded-full animate-pulse z-0"></span>
                )}

                <div className="relative z-10 text-white">
                    {isLoading ? (
                        <Loader2 className="animate-spin" size={24} />
                    ) : isCallActive ? (
                        <PhoneOff size={24} />
                    ) : (
                        <div className="relative">
                            <Phone size={24} className="fill-current" />
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-slate-900"></span>
                            </span>
                        </div>
                    )}
                </div>
            </button>
        </div>
    );
};

export default VoiceAssistant;
