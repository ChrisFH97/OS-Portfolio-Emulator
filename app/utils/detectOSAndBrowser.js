export const detectOSAndBrowser = () => {
    const { userAgent, platform } = window.navigator;
    
    const os = /Mac/i.test(platform)
      ? 'Mac OS'
      : /Win/i.test(platform)
      ? 'Windows'
      : /iPhone|iPad|iPod/i.test(platform)
      ? 'iOS'
      : /Android/i.test(userAgent)
      ? 'Android'
      : /Linux/i.test(platform)
      ? 'Linux'
      : 'Unknown OS';
  
    const browser = /Firefox/i.test(userAgent)
      ? 'Firefox'
      : /Edg/i.test(userAgent)
      ? 'Edge'
      : /Chrome/i.test(userAgent)
      ? 'Chrome'
      : /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)
      ? 'Safari'
      : /Opera|OPR/i.test(userAgent)
      ? 'Opera'
      : /MSIE|Trident/i.test(userAgent)
      ? 'Internet Explorer'
      : 'Unknown Browser';
  
    return { os, browser };
  };
  