export type Difficulty = "Easy" | "Medium" | "Hard";
export type ProblemStatus = "not-started" | "in-progress" | "solved";

export type DsaProblem = {
  id: number;
  title: string;
  difficulty: Difficulty;
  description: string;
  topics: string[];
  url: string;
};

export const arrayProblems: DsaProblem[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: "Find two numbers in an array that add up to a target value.",
    topics: ["Array", "Hash Table"],
    url: "https://leetcode.com/problems/two-sum/",
  },
  {
    id: 2,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    description: "Find the maximum profit from buying and selling a stock once.",
    topics: ["Array", "Greedy"],
    url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
  },
  {
    id: 3,
    title: "Maximum Subarray",
    difficulty: "Medium",
    description: "Find the contiguous subarray with the largest sum.",
    topics: ["Array", "Divide and Conquer", "Dynamic Programming"],
    url: "https://leetcode.com/problems/maximum-subarray/",
  },
  {
    id: 4,
    title: "Product of Array Except Self",
    difficulty: "Medium",
    description: "Return an array where each element is the product of all other elements.",
    topics: ["Array", "Prefix Sum"],
    url: "https://leetcode.com/problems/product-of-array-except-self/",
  },
  {
    id: 5,
    title: "Contains Duplicate",
    difficulty: "Easy",
    description: "Determine whether any value appears at least twice in an array.",
    topics: ["Array", "Hash Table"],
    url: "https://leetcode.com/problems/contains-duplicate/",
  },
  {
    id: 6,
    title: "Maximum Product Subarray",
    difficulty: "Medium",
    description: "Find the contiguous subarray with the largest product.",
    topics: ["Array", "Dynamic Programming"],
    url: "https://leetcode.com/problems/maximum-product-subarray/",
  },
  {
    id: 7,
    title: "Move Zeroes",
    difficulty: "Easy",
    description:
      "Move all zeroes to the end of the array while maintaining the order of non-zero elements.",
    topics: ["Array", "Two Pointers"],
    url: "https://leetcode.com/problems/move-zeroes/",
  },
  {
    id: 8,
    title: "Rotate Array",
    difficulty: "Medium",
    description: "Rotate the array to the right by k steps.",
    topics: ["Array", "Math", "Two Pointers"],
    url: "https://leetcode.com/problems/rotate-array/",
  },
  {
    id: 9,
    title: "Valid Anagram",
    difficulty: "Easy",
    description: "Determine whether two strings are anagrams of each other.",
    topics: ["Hash Table", "String", "Sorting"],
    url: "https://leetcode.com/problems/valid-anagram/",
  },
  {
    id: 10,
    title: "Intersection of Two Arrays",
    difficulty: "Easy",
    description: "Return the unique elements that appear in both arrays.",
    topics: ["Array", "Hash Table", "Two Pointers"],
    url: "https://leetcode.com/problems/intersection-of-two-arrays/",
  },
  {
    id: 11,
    title: "Majority Element",
    difficulty: "Easy",
    description: "Find the element that appears more than half of the time in the array.",
    topics: ["Array", "Hash Table", "Sorting"],
    url: "https://leetcode.com/problems/majority-element/",
  },
  {
    id: 12,
    title: "Merge Sorted Array",
    difficulty: "Easy",
    description: "Merge two sorted arrays into the first array in sorted order.",
    topics: ["Array", "Two Pointers", "Sorting"],
    url: "https://leetcode.com/problems/merge-sorted-array/",
  },
  {
    id: 13,
    title: "3Sum",
    difficulty: "Medium",
    description: "Find all unique triplets in the array that add up to zero.",
    topics: ["Array", "Two Pointers", "Sorting"],
    url: "https://leetcode.com/problems/3sum/",
  },
  {
    id: 14,
    title: "Container With Most Water",
    difficulty: "Medium",
    description:
      "Find two lines that together with the x-axis form a container holding the most water.",
    topics: ["Array", "Two Pointers", "Greedy"],
    url: "https://leetcode.com/problems/container-with-most-water/",
  },
  {
    id: 15,
    title: "Subarray Sum Equals K",
    difficulty: "Medium",
    description: "Count the number of subarrays whose sum equals k.",
    topics: ["Array", "Hash Table", "Prefix Sum"],
    url: "https://leetcode.com/problems/subarray-sum-equals-k/",
  },
  {
    id: 16,
    title: "Trapping Rain Water",
    difficulty: "Hard",
    description:
      "Calculate how much rainwater can be trapped between the bars of an elevation map.",
    topics: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
    url: "https://leetcode.com/problems/trapping-rain-water/",
  },
];

export const binarySearchProblems: DsaProblem[] = [
  {
    id: 1,
    title: "Binary Search",
    difficulty: "Easy",
    description: "Search for a target value in a sorted array.",
    topics: ["Array", "Binary Search"],
    url: "https://leetcode.com/problems/binary-search/",
  },
  {
    id: 2,
    title: "Search Insert Position",
    difficulty: "Easy",
    description: "Find the index where a target should be inserted in a sorted array.",
    topics: ["Array", "Binary Search"],
    url: "https://leetcode.com/problems/search-insert-position/",
  },
  {
    id: 3,
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    description: "Search for a target in a rotated sorted array.",
    topics: ["Array", "Binary Search"],
    url: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
  },
  {
    id: 4,
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    description: "Find the minimum element in a rotated sorted array.",
    topics: ["Array", "Binary Search"],
    url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
  },
  {
    id: 5,
    title: "Find Peak Element",
    difficulty: "Medium",
    description: "Find a peak element in an array using binary search.",
    topics: ["Array", "Binary Search"],
    url: "https://leetcode.com/problems/find-peak-element/",
  },
  {
    id: 6,
    title: "Koko Eating Bananas",
    difficulty: "Medium",
    description:
      "Find the minimum eating speed needed to finish all bananas within the given hours.",
    topics: ["Binary Search", "Greedy"],
    url: "https://leetcode.com/problems/koko-eating-bananas/",
  },
  {
    id: 7,
    title: "Capacity To Ship Packages Within D Days",
    difficulty: "Medium",
    description:
      "Find the minimum ship capacity needed to deliver all packages within the given number of days.",
    topics: ["Binary Search", "Greedy"],
    url: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/",
  },
];

export const stringProblems: DsaProblem[] = [
  {
    id: 1,
    title: "Valid Anagram",
    difficulty: "Easy",
    description: "Determine whether two strings are anagrams of each other.",
    topics: ["Hash Table", "String", "Sorting"],
    url: "https://leetcode.com/problems/valid-anagram/",
  },
  {
    id: 2,
    title: "Valid Palindrome",
    difficulty: "Easy",
    description:
      "Determine whether a string reads the same forward and backward after ignoring non-alphanumeric characters.",
    topics: ["String", "Two Pointers"],
    url: "https://leetcode.com/problems/valid-palindrome/",
  },
  {
    id: 3,
    title: "Longest Common Prefix",
    difficulty: "Easy",
    description: "Find the longest common prefix shared by all strings in an array.",
    topics: ["String"],
    url: "https://leetcode.com/problems/longest-common-prefix/",
  },
  {
    id: 4,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    description: "Find the length of the longest substring without repeating characters.",
    topics: ["String", "Hash Table", "Sliding Window"],
    url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
  },
  {
    id: 5,
    title: "Group Anagrams",
    difficulty: "Medium",
    description: "Group strings that are anagrams of each other.",
    topics: ["String", "Hash Table", "Sorting"],
    url: "https://leetcode.com/problems/group-anagrams/",
  },
  {
    id: 6,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    description: "Find the longest palindromic substring within a given string.",
    topics: ["String", "Dynamic Programming"],
    url: "https://leetcode.com/problems/longest-palindromic-substring/",
  },
  {
    id: 7,
    title: "Palindromic Substrings",
    difficulty: "Medium",
    description: "Count how many palindromic substrings exist in a given string.",
    topics: ["String", "Dynamic Programming"],
    url: "https://leetcode.com/problems/palindromic-substrings/",
  },
];
