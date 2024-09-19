import React from 'react';
import { connect } from "react-redux";

import { TabContent, TabPane } from "reactstrap";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";


//Import Components
import Profile from "./Tabs/Profile";
import Chats from "./Tabs/Chats";
import Groups from "./Tabs/Groups";
import Contacts from "./Tabs/Contacts";
import Settings from "./Tabs/Settings";

function ChatLeftSidebar(props) {

    const activeTab = props.activeTab;


    const AllUsers = useSelector((state) => state.Chat.users);
    const userUID = useSelector((state) => state.Auth.user.uid);
  
    const [userData, setUserData] = useState({
      name: "",
      email: "",
      profilePicture: "",
      time: "",
      location: "",
    });
  
    useEffect(() => {
      if (AllUsers && userUID) {
        const user = Object.values(AllUsers).find((user) => user.id === userUID);
        setUserData(user);
      }
    }, [AllUsers, userUID]);

    return (
        <React.Fragment>
            <div className="chat-leftsidebar me-lg-1">

                <TabContent activeTab={activeTab}  >
                    {/* Start Profile tab-pane */}
                    <TabPane tabId="profile" id="pills-user"   >
                        {/* profile content  */}
                        <Profile userData={userData} />
                    </TabPane>
                    {/* End Profile tab-pane  */}

                    {/* Start chats tab-pane  */}
                    <TabPane tabId="chat" id="pills-chat">
                        {/* chats content */}
                        <Chats recentChatList={props.recentChatList} userData={userData} />
                    </TabPane>
                    {/* End chats tab-pane */}

                    {/* Start groups tab-pane */}
                    <TabPane tabId="group" id="pills-groups">
                        {/* Groups content */}
                        <Groups />
                    </TabPane>
                    {/* End groups tab-pane */}

                    {/* Start contacts tab-pane */}
                    <TabPane tabId="contacts" id="pills-contacts">
                        {/* Contact content */}
                        <Contacts />
                    </TabPane>
                    {/* End contacts tab-pane */}

                    {/* Start settings tab-pane */}
                    <TabPane tabId="settings" id="pills-setting" >
                        {/* Settings content */}
                        <Settings  userData={userData}/>
                    </TabPane>
                    {/* End settings tab-pane */}
                </TabContent>
                {/* end tab content */}

            </div>
        </React.Fragment>
    );
}

const mapStatetoProps = state => {
    return {
        ...state.Layout
    };
};

export default connect(mapStatetoProps, null)(ChatLeftSidebar);