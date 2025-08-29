import { useState } from 'react';
import { Tabs, TabList, Tab } from '@mui/joy';
import TabPanel from '../TabPanel/TabPanel';
import Tab1Content from '../Tab1Content/Tab1Content';
import Tab2Content from '../Tab2Content/Tab2Content';
import Tab3Content from '../Tab3Content/Tab3Content';
import Tab4Content from '../Tab4Content/Tab4Content';
import Tab5Content from '../Tab5Content/Tab5Content';
import Tab6Content from '../Tab6Content/Tab6Content';
import styles from '../../styles/tabs.module.css';

export default function MainTabs() {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabs = [
    { label: 'Tab 1', component: Tab1Content },
    { label: 'Tab 2', component: Tab2Content },
    { label: 'Tab 3', component: Tab3Content },
    { label: 'Tab 4', component: Tab4Content },
    { label: 'Tab 5', component: Tab5Content },
    { label: 'Tab 6', component: Tab6Content },
  ];

  return (
    <div className={styles.tabsContainer}>
      <Tabs
        aria-label="Main navigation tabs"
        value={activeTab}
        onChange={handleChange}
        sx={{ bgcolor: 'transparent' }}
      >
        <TabList>
          {tabs.map((tab, index) => (
            <Tab key={index}>{tab.label}</Tab>
          ))}
        </TabList>
        
        {tabs.map((tab, index) => (
          <TabPanel key={index} value={activeTab} index={index}>
            <tab.component />
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
}
