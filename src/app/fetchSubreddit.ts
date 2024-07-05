import { z } from "zod";

export const fetchSubreddit = async (subreddit: string, attempts: number = 1): Promise<z.infer<typeof schema>> => {

  if (attempts > 3) {
    throw new Error(`Failed to fetch subreddit ${subreddit} after 3 attempts`)
  }

  const headers = new Headers();

  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");
  headers.set("User-Agent", "We out here having fun :)");

  const response = await fetch(
    `https://www.reddit.com/r/${subreddit}.json`,
    {
      headers,
      // next: { revalidate: 3600 },
    }
  );

  const data = await response.text();

  try {
    const json = JSON.parse(data);
    const parsedData = schema.strict().parse(json);
    return parsedData
  } catch (error) {
    console.error(data);

    if (error instanceof z.ZodError) {
      throw error;
    }

    return fetchSubreddit(subreddit, attempts + 1);
  }
}

const schema = z.object({
  kind: z.literal("Listing"),
  data: z.object({
    after: z.string(),
    dist: z.number(),
    modhash: z.string(),
    geo_filter: z.string().nullable(),
    children: z.array(
      z.object({
        kind: z.literal("t3"),
        data: z.object({
          approved_at_utc: z.string().nullable(),
          subreddit: z.string(),
          selftext: z.string().nullable().transform((v) => v ? v.length > 500 ? v.slice(0, 500) + "..." : v : v),
          author_fullname: z.string(),
          saved: z.boolean(),
          mod_reason_title: z.string().nullable(),
          gilded: z.number(),
          clicked: z.boolean(),
          title: z.string().transform((v) => v.replace(/&amp;/g, "&")),
          link_flair_richtext: z.array(z.object({
            e: z.literal("text"),
            t: z.string(),
          })),
          subreddit_name_prefixed: z.string(),
          hidden: z.boolean(),
          pwls: z.number().nullable(),
          link_flair_css_class: z.string().nullable(),
          downs: z.number(),
          thumbnail_height: z.number().nullable(),
          top_awarded_type: z.string().nullable(),
          hide_score: z.boolean(),
          name: z.string(),
          quarantine: z.boolean(),
          link_flair_text_color: z.string().nullable(),
          upvote_ratio: z.number(),
          author_flair_background_color: z.string().nullable(),
          subreddit_type: z.string(),
          ups: z.number(),
          total_awards_received: z.number(),
          media_embed: z.object({
            content: z.string().optional(),
            width: z.number().optional(),
            scrolling: z.boolean().optional(),
            height: z.number().optional(),
          }),
          thumbnail_width: z.number().nullable(),
          author_flair_template_id: z.string().nullable(),
          is_original_content: z.boolean(),
          user_reports: z.array(z.unknown()),
          secure_media: z.nullable(z.object({
            reddit_video: z.object({
              fallback_url: z.string(),
              height: z.number(),
              width: z.number(),
              scrubber_media_url: z.string(),
              dash_url: z.string(),
              duration: z.number(),
              hls_url: z.string(),
              is_gif: z.boolean(),
              transcoding_status: z.string(),
            }).optional(),
          })),
          is_reddit_media_domain: z.boolean(),
          is_meta: z.boolean(),
          category: z.string().nullable(),
          secure_media_embed: z.object({
            content: z.string().optional(),
            width: z.number().optional(),
            scrolling: z.boolean().optional(),
            media_domain_url: z.string().optional(),
            height: z.number().optional(),
          }),
          link_flair_text: z.string().nullable(),
          can_mod_post: z.boolean(),
          score: z.number(),
          approved_by: z.string().nullable(),
          author_premium: z.boolean(),
          thumbnail: z.string(),
          edited: z.union([z.boolean(), z.number()]).nullable(),
          author_flair_css_class: z.string().nullable(),
          author_flair_richtext: z.array(z.unknown()),
          gildings: z.object({
            gid_1: z.number().optional(),
            gid_2: z.number().optional(),
            gid_3: z.number().optional(),
          }),
          content_categories: z.string().nullable(),
          is_self: z.boolean(),
          created: z.number().transform((v) => new Date(v * 1000)),
          link_flair_type: z.string(),
          wls: z.number().nullable(),
          removed_by_category: z.string().nullable(),
          banned_by: z.string().nullable(),
          author_flair_type: z.string(),
          domain: z.string(),
          selftext_html: z.string().nullable(),
          likes: z.string().nullable(),
          suggested_sort: z.string().nullable(),
          banned_at_utc: z.string().nullable(),
          view_count: z.string().nullable(),
          archived: z.boolean(),
          no_follow: z.boolean(),
          is_crosspostable: z.boolean(),
          pinned: z.boolean(),
          over_18: z.boolean(),
          preview: z.object({
            images: z.array(z.object({
              source: z.object({
                url: z.string().transform((v) => v.replace(/&amp;/g, "&")),
                width: z.number(),
                height: z.number(),
              }),
              resolutions: z.array(z.object({
                url: z.string().transform((v) => v.replace(/&amp;/g, "&")),
                width: z.number(),
                height: z.number(),
              })),
              variants: z.object({
                obfuscated: z.object({
                  source: z.object({
                    url: z.string(),
                    width: z.number(),
                    height: z.number(),
                  }),
                  resolutions: z.array(z.object({
                    url: z.string(),
                    width: z.number(),
                    height: z.number(),
                  })),
                }).optional(),
              }),
              id: z.string(),
            })),
            enabled: z.boolean(),
          }).optional(),
          all_awardings: z.array(z.unknown()),
          awarders: z.array(z.unknown()),
          media_only: z.boolean(),
          can_gild: z.boolean(),
          spoiler: z.boolean(),
          locked: z.boolean(),
          author_flair_text: z.string().nullable(),
          treatment_tags: z.array(z.unknown()),
          visited: z.boolean(),
          removed_by: z.string().nullable(),
          num_reports: z.string().nullable(),
          distinguished: z.string().nullable(),
          subreddit_id: z.string(),
          author_is_blocked: z.boolean(),
          mod_reason_by: z.string().nullable(),
          removal_reason: z.string().nullable(),
          link_flair_background_color: z.string().nullable(),
          id: z.string(),
          is_robot_indexable: z.boolean(),
          report_reasons: z.string().nullable(),
          author: z.string(),
          discussion_type: z.string().nullable(),
          num_comments: z.number(),
          send_replies: z.boolean(),
          whitelist_status: z.string().nullable(),
          contest_mode: z.boolean(),
          mod_reports: z.array(z.unknown()),
          author_patreon_flair: z.boolean(),
          author_flair_text_color: z.string().nullable(),
          permalink: z.string(),
          parent_whitelist_status: z.string().nullable(),
          stickied: z.boolean(),
          url: z.string(),
          subreddit_subscribers: z.number(),
          created_utc: z.number(),
          num_crossposts: z.number(),
          media: z.nullable(z.object({
            reddit_video: z.object({
              fallback_url: z.string(),
              height: z.number(),
              width: z.number(),
              scrubber_media_url: z.string(),
              dash_url: z.string(),
              duration: z.number(),
              hls_url: z.string(),
              is_gif: z.boolean(),
              transcoding_status: z.string(),
            }).optional(),
          })),
          is_video: z.boolean(),
        })
      })
    )
  })
})

export type Subreddit = z.infer<typeof schema>;
export type SubredditData = Subreddit["data"];
export type SubredditPost = SubredditData["children"][number]["data"];
export type SubredditPosts = SubredditPost[];
