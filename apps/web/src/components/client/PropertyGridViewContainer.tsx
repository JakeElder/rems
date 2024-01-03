"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { PropertyRow, PropertyRowContainer } from "@rems/ui";
import useProperties from "@/hooks/use-properties";
import {
  useAssistantSelectedProperty,
  useDispatch,
  useShowDistance,
  useSort,
  useTimeline,
  useUserSelectedProperty
} from "@/state";
import {
  registerSelectedProperty,
  setSelectedProperty
} from "@rems/state/app/actions";
import fetch from "@/fetch";
import { Property } from "@rems/types";
import { Controller } from "@react-spring/web";

type Props = {};

const PropertyGridViewContainer = ({}: Props) => {
  const { data, isLoading } = useProperties({ target: "LISTINGS" });
  const dispatch = useDispatch();
  const userSelectedPropertyId = useUserSelectedProperty();
  const assistantSelectedPropertyId = useAssistantSelectedProperty();
  const $rows = useRef<Map<Property["id"], HTMLDivElement | null>>(new Map());
  const $container = useRef<HTMLDivElement>(null);
  const $controller = useRef(
    new Controller({
      scroll: 0,
      onChange: ({ value }) => {
        requestAnimationFrame(() => {
          window.scroll({ top: value.scroll });
        });
      }
    })
  );
  const showDistance = useShowDistance();
  const timeline = useTimeline();

  useEffect(() => {
    const e = timeline[timeline.length - 1];
    if (
      e &&
      e.event.type === "ANALYSIS_PERFORMED" &&
      e.event.analysis.intents.includes("CLEAR_QUERY_COMPLETELY")
    ) {
      console.log("scrolling");
      $controller.current.start({ scroll: 1 });
    }
  }, [timeline]);

  useEffect(() => {
    if (!$container.current || !$rows.current || !assistantSelectedPropertyId) {
      return;
    }

    const containerBb = $container.current.getBoundingClientRect();
    const top = window.scrollY + containerBb.top;
    const $row = $rows.current.get(assistantSelectedPropertyId);
    const rowBb = $row!.getBoundingClientRect();
    const target = rowBb.top + window.scrollY;

    $controller.current.start({ scroll: target - top });
  }, [assistantSelectedPropertyId]);

  const getSelection = useCallback(
    (id: Property["id"]) => {
      if (userSelectedPropertyId === id) return "USER";
      if (assistantSelectedPropertyId === id) return "ASSISTANT";
      return null;
    },
    [userSelectedPropertyId, assistantSelectedPropertyId]
  );

  return (
    <PropertyRowContainer loading={isLoading} ref={$container}>
      {(data?.data || []).map((p) => (
        <PropertyRow
          showDistance={
            data?.location.resolution.type === "POINT" && showDistance
          }
          ref={($el) => $rows.current.set(p.id, $el)}
          key={p.id}
          type={data!.query.budgetAndAvailability.type}
          property={p}
          selection={getSelection(p.id)}
          onClick={(e) => {
            e.preventDefault();
            fetch("property", p.id).then((p) => {
              dispatch(
                registerSelectedProperty({
                  role: "USER",
                  property: p
                })
              );
            });
            dispatch(
              setSelectedProperty({
                role: "USER",
                id: userSelectedPropertyId === p.id ? null : p.id
              })
            );
          }}
        />
      ))}
    </PropertyRowContainer>
  );
};

export default PropertyGridViewContainer;
