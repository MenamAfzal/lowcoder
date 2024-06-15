import { UICompBuilder, withDefault } from "../generators";
import { Section, sectionNames } from "lowcoder-design";
import { StringControl } from "../controls/codeControl";
import { BoolControl } from "../controls/boolControl";
import styled from "styled-components";
import { NameConfig, NameConfigHidden, withExposingConfigs } from "../generators/withExposing";
import { styleControl } from "comps/controls/styleControl";
import { AnimationStyle, AnimationStyleType, IframeStyle, IframeStyleType } from "comps/controls/styleControlConstants";
import { hiddenPropertyView } from "comps/utils/propertyUtils";
import { trans } from "i18n";
import log from "loglevel";

import { useContext, useEffect } from "react";
import { EditorContext } from "comps/editorState";
import { ThemeContext } from "../utils/themeContext";
import { CompTypeContext } from "../utils/compTypeContext";
import { setInitialCompStyles } from "../utils/themeUtil";

const Wrapper = styled.div<{$style: IframeStyleType; $animationStyle:AnimationStyleType}>`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: ${(props) =>
      props.$style.borderWidth ? props.$style.borderWidth : '1px'}
    solid ${(props) => props.$style.border};
  border-radius: calc(min(${(props) => props.$style.radius}, 20px));
rotate:${props => props.$style.rotation}
${props=>props.$animationStyle}
  iframe {
    border: 0;
    width: 100%;
    height: 100%;
    display: block;
    background-color: ${(props) => props.$style.background};
  }
`;

const regex =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/g;

let IFrameCompBase = new UICompBuilder(
  {
    url: StringControl,
    allowDownload: BoolControl,
    allowSubmitForm: BoolControl,
    allowMicrophone: BoolControl,
    allowCamera: BoolControl,
    allowPopup: BoolControl,
    style: styleControl(IframeStyle,'style'),
    animationStyle: styleControl(AnimationStyle,'animationStyle'),
  },
  (props, dispatch) => {
    const theme = useContext(ThemeContext);
    const compType = useContext(CompTypeContext);
    const compTheme = theme?.theme?.components?.[compType];
    const styleProps: Record<string, any> = {};
    ['style', 'animationStyle'].forEach(
      (key: string) => {
        styleProps[key] = (props as any)[key];
      }
    );

    useEffect(() => {
      setInitialCompStyles({
        dispatch,
        compTheme,
        styleProps,
      });
    }, []);
    const sandbox = ["allow-scripts", "allow-same-origin"];
    props.allowSubmitForm && sandbox.push("allow-forms");
    props.allowDownload && sandbox.push("allow-downloads");
    props.allowPopup && sandbox.push("allow-popups");

    const allow = [];
    props.allowCamera && allow.push("camera");
    props.allowMicrophone && allow.push("microphone");

    const src = regex.test(props.url) ? props.url : "about:blank";
    log.log(props.url, regex.test(props.url) ? props.url : "about:blank", src);
    return (
      <Wrapper $style={props.style} $animationStyle={props.animationStyle}>
        <iframe src={src} sandbox={sandbox.join(" ")} allow={allow.join(";")} />
      </Wrapper>
    );
  }
)
  .setPropertyViewFn((children) => (
    <>
      <Section name={sectionNames.basic}>
        {children.url.propertyView({ label: "Source URL", placeholder: "https://example.com", tooltip: trans("iframe.URLDesc") })}
      </Section>

      {["logic", "both"].includes(useContext(EditorContext).editorModeStatus) && (
        <Section name={sectionNames.interaction}>
          {hiddenPropertyView(children)}
          {children.allowDownload.propertyView({ label: trans("iframe.allowDownload") })}
          {children.allowSubmitForm.propertyView({ label: trans("iframe.allowSubmitForm") })}
          {children.allowMicrophone.propertyView({ label: trans("iframe.allowMicrophone") })}
          {children.allowCamera.propertyView({ label: trans("iframe.allowCamera") })}
          {children.allowPopup.propertyView({ label: trans("iframe.allowPopup") })}
        </Section>
      )}

      {["layout", "both"].includes(useContext(EditorContext).editorModeStatus) && (
        <>
        <Section name={sectionNames.style}>
          {children.style.getPropertyView()}
        </Section>
        <Section name={sectionNames.animationStyle} hasTooltip={true}>
          {children.animationStyle.getPropertyView()}
          </Section>
        </>
      )}
    </>
  ))
  .build();

IFrameCompBase = class extends IFrameCompBase {
  override autoHeight(): boolean {
    return false;
  }
};

export const IFrameComp = withExposingConfigs(IFrameCompBase, [
  new NameConfig("url", trans("iframe.URLDesc")),
  NameConfigHidden,
]);
