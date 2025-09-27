import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Mic, MicOff, Volume2 } from "lucide-react";

interface FakeCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FakeCallModal({ isOpen, onClose }: FakeCallModalProps) {
  const [callState, setCallState] = useState<'incoming' | 'active' | 'ended'>('incoming');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [callerName, setCallerName] = useState('Mom');
  const [isRinging, setIsRinging] = useState(true);

  const callerOptions = ['Mom', 'Dad', 'Best Friend', 'Sister', 'Brother', 'Work', 'Doctor', 'Emergency Contact'];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (callState === 'active') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (callState === 'incoming' && isRinging) {
      // Stop ringing after 30 seconds if not answered
      timeout = setTimeout(() => {
        setIsRinging(false);
        setCallState('ended');
      }, 30000);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [callState, isRinging]);

  const answerCall = () => {
    setCallState('active');
    setIsRinging(false);
    setCallDuration(0);
  };

  const endCall = () => {
    setCallState('ended');
    setIsRinging(false);
    setTimeout(() => {
      onClose();
      // Reset state for next call
      setCallState('incoming');
      setCallDuration(0);
      setIsMuted(false);
      setIsRinging(true);
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-sm h-[600px] bg-black text-white border-none p-0 overflow-hidden"
        data-testid="fake-call-modal"
      >
        <div className="relative h-full flex flex-col">
          {/* Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black"></div>
          
          {/* Status Bar */}
          <div className="relative z-10 p-4 text-center">
            <div className="text-sm opacity-75">
              {callState === 'incoming' && isRinging && 'Incoming call...'}
              {callState === 'active' && formatTime(callDuration)}
              {callState === 'ended' && 'Call ended'}
            </div>
          </div>

          {/* Caller Info */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl font-bold text-white">
                {callerName.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Caller Name */}
            <h2 className="text-2xl font-semibold mb-2">{callerName}</h2>
            
            {/* Call Status */}
            <p className="text-lg opacity-75 mb-8">
              {callState === 'incoming' && isRinging && (
                <span className={`${isRinging ? 'animate-pulse' : ''}`}>
                  Calling...
                </span>
              )}
              {callState === 'active' && 'Connected'}
              {callState === 'ended' && 'Disconnected'}
            </p>

            {/* Change Caller Option */}
            {callState === 'incoming' && (
              <div className="mb-4">
                <select 
                  value={callerName} 
                  onChange={(e) => setCallerName(e.target.value)}
                  className="bg-gray-700 text-white rounded px-3 py-1 text-sm"
                  data-testid="select-caller"
                >
                  {callerOptions.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Call Controls */}
          <div className="relative z-10 p-6">
            {callState === 'incoming' && isRinging && (
              <div className="flex justify-center space-x-8">
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={endCall}
                  data-testid="button-decline-call"
                >
                  <PhoneOff className="h-6 w-6" />
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={answerCall}
                  data-testid="button-answer-call"
                >
                  <Phone className="h-6 w-6" />
                </Button>
              </div>
            )}

            {callState === 'active' && (
              <div className="flex justify-center space-x-6">
                <Button
                  size="lg"
                  variant="ghost"
                  className={`w-14 h-14 rounded-full ${isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
                  onClick={toggleMute}
                  data-testid="button-toggle-mute"
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={endCall}
                  data-testid="button-end-call"
                >
                  <PhoneOff className="h-6 w-6" />
                </Button>
                
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-14 h-14 rounded-full bg-gray-600 hover:bg-gray-700 text-white"
                  data-testid="button-speaker"
                >
                  <Volume2 className="h-5 w-5" />
                </Button>
              </div>
            )}

            {callState === 'ended' && (
              <div className="text-center">
                <p className="text-sm opacity-75 mb-4">
                  Call duration: {formatTime(callDuration)}
                </p>
                <p className="text-xs opacity-50">
                  Window will close automatically...
                </p>
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="relative z-10 p-4 bg-gray-900 bg-opacity-50">
            <p className="text-xs text-center opacity-75">
              This is a realistic fake call to help you exit uncomfortable situations safely.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}