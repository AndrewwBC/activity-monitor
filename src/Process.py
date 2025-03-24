import psutil
from typing import List
class Process:
    
    def __init__(self, processesToMonitor: List[str]):
        self._processesToMonitor: List[str] = processesToMonitor
        self._processInUse: List[str] = []
    
    def setProcessInUse(self):
        print(self._processesToMonitor[0])
        for process in psutil.process_iter(["pid", "name"]):
            if process.name() in self._processesToMonitor:
                self._processInUse.append(process.name())
                self._processesToMonitor.remove(process.name())
    
    def getProcessInUse(self) -> List[str]:
        return self._processInUse

proc = Process(["chrome.exe", "Code.exe"])

print(proc.setProcessInUse())
print(proc.getProcessInUse())