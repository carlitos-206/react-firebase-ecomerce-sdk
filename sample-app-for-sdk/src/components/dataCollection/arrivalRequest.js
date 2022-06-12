import { useEffect } from 'react';
// Firabase
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../db';

// UserAgent
const parser = require('ua-parser-js');

export default function CollectArrival() {
  function uploadToFirestore(tree) {
    const entriesRef = collection(db, 'visitorCollection');
    addDoc(entriesRef, {
      location: {
        ip: tree.location.ip,
        city: tree.location.city,
        state: tree.location.state,
        postal: tree.location.postal,
        country: tree.location.country,
        timezone: tree.location.timeZone,
        timeDiff: tree.location.timeDiff,
        exact_location: {
          lat: tree.location.exactLocation.lat,
          lon: tree.location.exactLocation.lon,
        },
      },
      device: {
        type: tree.device.type,
        model: tree.device.model,
        vendor: tree.device.vendor,
        screenWidth: tree.device.screenWidth,
        screenHeight: tree.device.screenHeight,
      },
      browser: {
        name: tree.browser.name,
        version: tree.browser.version,
      },
      date_visited: new Date().toString(),
    });
  }
  useEffect(() => {
    async function fetchIpAndUAInfo() {
      // IP Info API
      const ipUrl = `https://ipinfo.io/?token=${process.env.REACT_APP_IP_API_KEY}`;
      const publicResponse = await fetch(ipUrl);
      const publicData = await publicResponse.json();
      const publicDataLocation = publicData.loc;
      const locationArray = publicDataLocation.split(',');

      // TimeZone diff API
      const timeZoneResponse = await fetch(`http://api.timezonedb.com/v2.1/convert-time-zone?key=${process.env.REACT_APP_TIMEZONE_API_KEY}&format=json&from=America/Los_Angeles&to=${publicData.timezone}`);
      const timeZoneData = await timeZoneResponse.json();
      const timeDiffData = (timeZoneData.fromTimestamp - timeZoneData.toTimestamp);
      let timeDiffRead = null;
      if (timeDiffData < 0) {
        const timeDiffAbsolute = Math.abs(timeDiffData);
        const timeDiffHours = ((timeDiffAbsolute / 60) / 60);
        timeDiffRead = `Ahead by ${timeDiffHours} hours`;
      }
      if (timeDiffData > 0) {
        const timeDiffHours = ((timeDiffData / 60) / 60);
        timeDiffRead = `Behind by ${timeDiffHours} hours`;
      }
      if (timeDiffData === 0) {
        timeDiffRead = 'No Time Difference';
      }
      //  // .
      //  // .
      // UA AU Parser
      const ua = parser(navigator.userAgent);
      let deviceType = null;
      let deviceModel = null;
      let deviceVendor = null;
      if (ua.device.model === undefined) {
        if (ua.os.name === 'Windows') {
          deviceType = 'Desktop';
          deviceModel = 'N/A';
          deviceVendor = 'N/A';
        }
        if (ua.os.name === undefined) {
          deviceType = 'N/A';
          deviceModel = 'N/A';
          deviceVendor = 'N/A';
        }
      }
      if (ua.device.model !== undefined) {
        deviceType = ua.device.type;
        deviceModel = ua.device.model;
        deviceVendor = ua.device.vendor;
      }
      // Info Tree
      const userInfoTree = {
        location: {
          ip: publicData.ip,
          city: publicData.city,
          state: publicData.region,
          postal: publicData.postal,
          country: publicData.country,
          timeZone: publicData.timezone,
          timeDiff: timeDiffRead,
          exactLocation: {
            lat: locationArray[0],
            lon: locationArray[1],
          },

        },
        device: {
          type: deviceType,
          model: deviceModel,
          vendor: deviceVendor,
          screenWidth: `${window.innerWidth}px`,
          screenHeight: `${window.innerHeight}px`,
        },
        browser: {
          name: ua.browser.name,
          version: ua.browser.version,
        },
      };
      uploadToFirestore(userInfoTree);
    }
    fetchIpAndUAInfo();
  }, []);
}
