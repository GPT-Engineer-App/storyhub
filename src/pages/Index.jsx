import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const response = await fetch(
          "https://hacker-news.firebaseio.com/v0/topstories.json"
        );
        const storyIds = await response.json();
        const topStoryIds = storyIds.slice(0, 10); // Fetch top 10 stories

        const storyPromises = topStoryIds.map(async (id) => {
          const storyResponse = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json`
          );
          return storyResponse.json();
        });

        const stories = await Promise.all(storyPromises);
        setStories(stories);
      } catch (error) {
        console.error("Failed to fetch top stories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopStories();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl text-center mb-4">Hacker News Top Stories</h1>
      <div className="space-y-4">
        {stories.map((story) => (
          <Card key={story.id}>
            <CardHeader>
              <CardTitle>
                <a href={story.url} target="_blank" rel="noopener noreferrer">
                  {story.title}
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Score: {story.score}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;