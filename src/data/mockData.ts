
import { Capsule, User } from "@/types";
import { getRandomPointInRadius } from "@/lib/location";

// Current user
export const currentUser: User = {
  id: "current-user",
  nickname: "Explorer" + Math.floor(Math.random() * 1000),
  createdAt: new Date().toISOString(),
};

// Generate random capsules around a location
export function generateMockCapsules(
  centerLat: number,
  centerLng: number,
  count: number = 5
): Capsule[] {
  const capsules: Capsule[] = [];

  for (let i = 0; i < count; i++) {
    const randomLocation = getRandomPointInRadius(centerLat, centerLng, 500);
    
    capsules.push({
      id: `capsule-${i + 1}`,
      title: `Time Capsule ${i + 1}`,
      description: [
        "A memory from the past waiting to be discovered.",
        "A snapshot of campus life in 2023.",
        "Stories from students who walked these paths before you.",
        "Messages from the past for future generations.",
        "Thoughts and reflections from a bygone era.",
      ][i % 5],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random date in the last 30 days
      location: randomLocation,
      radius: 20 + Math.floor(Math.random() * 80), // Random radius between 20-100m
      content: [
        {
          id: `content-${i}-1`,
          type: "text",
          value: [
            "This spot used to be where students would gather before finals. Good luck on yours!",
            "We buried a real time capsule somewhere in this area in 2020. See if you can find the physical marker!",
            "The best coffee on campus is actually at the little shop in the engineering building, not the main cafeteria.",
            "Take some time to appreciate this view. In our day, we'd come here to destress during exam season.",
            "We were here during the lockdown of 2020. Strange times, but we made it through. You will too.",
          ][i % 5],
        },
        {
          id: `content-${i}-2`,
          type: "image",
          value: `https://picsum.photos/seed/capsule${i}/300/200`,
          caption: "A memory from this location",
        },
      ],
      createdBy: [
        "AlumniFromThe90s",
        "ClassOf2023",
        "CampusHistorian",
        "ProfessorEmeritus",
        "GraduateResearcher",
      ][i % 5],
      isPublic: true,
      tags: ["campus", "history", "student life"],
    });
  }

  return capsules;
}
