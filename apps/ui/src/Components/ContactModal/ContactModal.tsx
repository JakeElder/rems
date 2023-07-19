"use client";

import React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import CloseIcon from "../../Elements/CloseIcon";
import css from "./ContactModal.module.css";
import { animated, useTransition } from "@react-spring/web";
import * as ContactForm from "../../Components/ContactForm";
import * as Dialog from "../../Components/Dialog";
import Monogram from "../../Elements/Monogram";
import { RemoveScroll } from "react-remove-scroll";
import cn from "classnames";
import { Property } from "@rems/types";

type Props = React.ComponentProps<typeof RadixDialog.Root> & {
  onMessageSent?: () => void;
  defaultMessage?: string;
  mode?: "contact" | "question";
  uid?: Property["uid"];
};

const ContactModal = ({
  open,
  onOpenChange,
  onMessageSent,
  defaultMessage,
  mode = "contact",
  uid
}: Props) => {
  const transitions = useTransition(open, {
    from: {
      bgOpacity: 0,
      dialogOpacity: 0,
      scale: 0.95,
      boxShadow: "0 0 17px -6px rgba(0, 0, 0, 0)"
    },
    enter: {
      bgOpacity: 0.4,
      dialogOpacity: 1,
      scale: 1,
      boxShadow: "0 0 17px -6px rgba(0, 0, 0, 0.5)"
    },
    leave: {
      bgOpacity: 0,
      dialogOpacity: 0,
      scale: 0.95,
      boxShadow: "0 0 17px -6px rgba(0, 0, 0, 0)"
    }
  });

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {transitions((styles, show) =>
        show ? (
          <>
            <RadixDialog.Overlay forceMount asChild>
              <animated.div
                style={{ opacity: styles.bgOpacity }}
                className={cn(
                  css["overlay"],
                  RemoveScroll.classNames.fullWidth
                )}
              />
            </RadixDialog.Overlay>
            <RadixDialog.Content forceMount>
              <div className={css["wrapper"]}>
                <animated.div
                  className={css["content"]}
                  style={{
                    opacity: styles.dialogOpacity,
                    boxShadow: styles.boxShadow,
                    scale: styles.scale
                  }}
                >
                  <Dialog.Root>
                    <ContactForm.Root
                      uid={uid}
                      onMessageSent={onMessageSent}
                      defaultMessage={defaultMessage}
                      mode={mode}
                    >
                      <Dialog.Header>
                        <div className={css["header"]}>
                          <RadixDialog.Title>
                            <div className={css["title"]}>
                              <div className={css["monogram"]}>
                                <Monogram />
                              </div>
                              {mode === "contact"
                                ? "Contact Us"
                                : "Ask a Question"}
                            </div>
                          </RadixDialog.Title>
                          <RadixDialog.Close>
                            <div className={css["close"]}>
                              <CloseIcon />
                            </div>
                          </RadixDialog.Close>
                        </div>
                      </Dialog.Header>
                      <Dialog.Main>
                        {mode === "question" ? (
                          <div className={css["how"]}>
                            How can we get back to you?
                          </div>
                        ) : null}
                        <ContactForm.Controls />
                      </Dialog.Main>
                      <Dialog.Footer>
                        <ContactForm.Submit />
                      </Dialog.Footer>
                    </ContactForm.Root>
                  </Dialog.Root>
                </animated.div>
              </div>
            </RadixDialog.Content>
          </>
        ) : null
      )}
      <RadixDialog.Portal></RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

export default ContactModal;
