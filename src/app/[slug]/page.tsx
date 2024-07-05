import { Fragment } from "react";
import { fetchSubreddit, SubredditPost } from "../fetchSubreddit";
import { formatDistanceStrict } from "date-fns";
import Markdown from "react-markdown";
import { MessageSquareIcon, ShareIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

type PageParams = {
  params: {
    slug: string;
  }
}

export default async function Home(props: PageParams) {
  const { data: { children: posts } } = await fetchSubreddit(props.params.slug);

  return (
    <main>
      <ul className="mx-auto max-w-3xl flex flex-col">
        {posts.map(({ data: post }) => (
          <Fragment key={post.id}>
            <Post {...post} />
          </Fragment>
        ))}
      </ul>
    </main>
  );
}

// export const generateStaticParams = async () => {
//   return ["nextjs", "reactjs", "typescript"].map((slug) => ({ slug } satisfies PageParams["params"]))
// }

const Post = (post: SubredditPost) => {
  return (
    <li className="border-t flex flex-col gap-2 py-2">

      <div className="w-full flex flex-row justify-between">
        <div className="flex flex-row gap-2 items-center">
          <span className="text-sm text-zinc-800">u/{post.author}</span>
          <span className="text-sm text-zinc-500">· {formatDistanceStrict(post.created, new Date(), { addSuffix: true })}</span>
        </div>
      </div>

      <span className="font-medium">{post.title}</span>

      <PostFlair post={post} />
      <PostContent post={post} />
      <PostActions post={post} />

    </li>
  )
}

const PostFlair = ({ post }: { post: SubredditPost }) => {
  if (!post.link_flair_text) {
    return null;
  }

  return (
    <div className="-mt-1">
      <span style={{ color: post.link_flair_text_color === "dark" ? "black" : "white", backgroundColor: post.link_flair_background_color ?? undefined }} className="text-[10px] rounded-full px-1.5 py-0.5">
        {post.link_flair_text}
      </span>
    </div>
  )
}

const PostContent = ({ post }: { post: SubredditPost }) => {
  if (post.preview?.images) {

    const { source, resolutions } = post.preview.images[0];

    const isGif = new URL(source.url).pathname.endsWith(".gif");

    return (
      <picture className="w-full rounded-2xl overflow-hidden">
        <img className="w-full" src={isGif ? post.url : source.url} alt={post.title} height={source.height} width={source.width} />
        {resolutions
          .toSorted((a, b) => b.width - a.width)
          .map((resolution) => (
            <source key={resolution.url} srcSet={resolution.url} media={`(min-width: ${resolution.width}px)`} height={resolution.height} width={resolution.width} />
          ))}
      </picture>
    )
  }

  if (post.selftext) {
    return <Markdown className="text-sm text-zinc-600 font-light overflow-hidden">{post.selftext}</Markdown>
  }
}

const PostActions = ({ post }: { post: SubredditPost }) => {
  return (
    <div className="flex flex-row gap-2">
      <div className="bg-zinc-100 flex flex-row justify-center items-center rounded-3xl">
        <button className="group hover:bg-zinc-200 transition-colors p-2 rounded-3xl">
          <ThumbsUpIcon className="size-5 group-hover:text-red-600" />
        </button>
        <span className="text-sm">{post.score}</span>
        <button className="group hover:bg-zinc-200 transition-colors p-2 rounded-3xl">
          <ThumbsDownIcon className="size-5 group-hover:text-purple-600" />
        </button>
      </div>

      <button className="bg-zinc-100 hover:bg-zinc-200 transition-colors flex flex-row gap-2 justify-center items-center px-3 py-2 rounded-3xl">
        <MessageSquareIcon className="size-5" />
        <span className="text-sm">{post.num_comments}</span>
      </button>

      <button className="bg-zinc-100 hover:bg-zinc-200 transition-colors flex flex-row gap-2 justify-center items-center px-3 py-2 rounded-3xl">
        <ShareIcon className="size-5" />
        <span className="text-sm">Share</span>
      </button>
    </div>
  )
}