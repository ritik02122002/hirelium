import HIRELIUM_LOGO from "../assets/HIRELIUM_LOGO_LESS_CROP.png";
import HIRELIUM_TEXT from "../assets/HIRELIUM_STYLISH_TEXT.png";
import { FOOTER_CONTENT } from "../utility/constants";
const Footer = () => {
  return (
    <div className="flex w-full">
      <div className="flex items-center *:mx-2 bg-white w-fit py-4">
        <img src={HIRELIUM_LOGO} className="h-14 rounded-md" />
        <img src={HIRELIUM_TEXT} className="h-10" />
      </div>
      <div className="grid grid-rows-3 grid-flow-col bg-black *:text-white justify-between  flex-1 *:px-3 py-4">
        {FOOTER_CONTENT.map((content) => (
          <p key={content}>{content}</p>
        ))}
      </div>
    </div>
  );
};

export default Footer;
