import "./ProfilePage.css";

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <div className="primary">
        <div className="title">Log Out</div>
      </div>
      <div className="primary1">
        <div className="title">Update Cuisine Selection</div>
      </div>
      <div className="primary2">
        <div className="title">Delete Account</div>
      </div>
      <div className="depth-4-frame-0">
        <div className="depth-5-frame-0">
          <b className="profile-page1">Profile Page</b>
        </div>
      </div>
      <div className="top-bar">
        <div className="title3">MasterCook</div>
        <div className="navigation">
          <div className="tab">Home</div>
          <div className="tab">Chef</div>
          <div className="tab">Profile</div>
        </div>
      </div>
      <div className="do-you-want">{`Do you want to Log Out?, This may result in logging again `}</div>
      <div className="username-sri-container">
        <p className="username-sri">Username - Sri</p>
        <p className="username-sri">Email - sriharish.2019357@iit.ac.lk</p>
      </div>
      <div className="do-you-want1">{`Do you want to Delete Account?, This may result in signing up again `}</div>
      <div className="frame-parent">
        <div className="instance-parent">
          <div className="icons-parent">
            <img className="icons" alt="" src="/icons.svg" />
            <div className="option-1">American</div>
          </div>
          <div className="icons-parent">
            <img className="icons" alt="" src="/icons.svg" />
            <div className="option-1">Italian</div>
          </div>
        </div>
        <div className="instance-group">
          <div className="icons-container">
            <img className="icons" alt="" src="/icons.svg" />
            <div className="option-1">Mediterranean</div>
          </div>
          <div className="frame-div">
            <img className="icons" alt="" src="/icons.svg" />
            <div className="option-1">Jewish</div>
          </div>
        </div>
        <div className="instance-wrapper">
          <div className="icons-parent">
            <img className="icons" alt="" src="/icons.svg" />
            <div className="option-1">Barbecue</div>
          </div>
        </div>
        <div className="icons-parent2">
          <img className="icons" alt="" src="/icons.svg" />
          <div className="option-1">British</div>
        </div>
        <div className="instance-container">
          <div className="icons-parent3">
            <img className="icons" alt="" src="/icons.svg" />
            <div className="option-1">Cajun</div>
          </div>
          <div className="icons-parent3">
            <img className="icons" alt="" src="/icons.svg" />
            <div className="option-17">South American</div>
          </div>
        </div>
        <div className="instance-parent1">
          <div className="icons-parent">
            <img className="icons" alt="" src="/icons.svg" />
            <div className="option-1">Central American</div>
          </div>
          <div className="icons-parent">
            <img className="icons" alt="" src="/icons.svg" />
            <div className="option-1">Greek</div>
          </div>
        </div>
        <div className="instance-parent2">
          <div className="icons-parent">
            <img className="icons" alt="" src="/icons.svg" />
            <div className="option-1">Korean</div>
          </div>
          <div className="icons-parent">
            <img className="icons" alt="" src="/icons.svg" />
            <div className="option-1">Southern</div>
          </div>
        </div>
        <div className="instance-parent3">
          <div className="icons-parent">
            <img className="icons" alt="" src="/icons.svg" />
            <div className="option-1">Eastern European</div>
          </div>
          <div className="icons-parent">
            <img className="icons" alt="" src="/icons.svg" />
            <div className="option-1">European</div>
          </div>
        </div>
        <div className="instance-parent4">
          <div className="icons-parent">
            <img className="icons" alt="" src="/icons.svg" />
            <div className="option-1">Japanese</div>
          </div>
          <div className="icons-parent">
            <img className="icons" alt="" src="/icons.svg" />
            <div className="option-1">Thai</div>
          </div>
        </div>
        <div className="instance-parent5">
          <div className="icons-parent">
            <img className="icons" alt="" src="/icons.svg" />
            <div className="option-1">Indian</div>
          </div>
          <div className="icons-parent">
            <img className="icons" alt="" src="/icons.svg" />
            <div className="option-1">Chinese</div>
          </div>
        </div>
        <div className="instance-parent6">
          <div className="icons-parent">
            <img className="icons" alt="" src="/icons.svg" />
            <div className="option-1">Mexican</div>
          </div>
          <div className="icons-parent">
            <img className="icons" alt="" src="/icons.svg" />
            <div className="option-1">French</div>
          </div>
        </div>
        <div className="button" />
      </div>
    </div>
  );
};

export default ProfilePage;
