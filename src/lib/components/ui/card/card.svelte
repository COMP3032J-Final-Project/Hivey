<script lang="ts" module>
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";
	import { type VariantProps, tv } from "tailwind-variants";

	export const cardVariants = tv({
		base: "bg-card text-card-foreground border",
		variants: {
			size: {
				sm: "p-4 text-sm",
				md: "p-6 text-base",
				lg: "p-8 text-lg",
			},
			shadow: {
				none: "shadow-none",
				sm: "shadow-sm",
				md: "shadow-md",
				lg: "shadow-lg",
			},
			rounded: {
				none: "rounded-none",
				sm: "rounded-sm",
				md: "rounded-md",
				lg: "rounded-lg",
			},
			blur: {
				none: "backdrop-blur-none",
				sm: "backdrop-blur-sm",
				md: "backdrop-blur-md",
				lg: "backdrop-blur-lg",
			},
		},
		defaultVariants: {
			size: "lg",
			shadow: "lg",
			rounded: "lg",
			blur: "lg",
		},
	});

	export type CardSize = VariantProps<typeof cardVariants>["size"];
	export type CardShadow = VariantProps<typeof cardVariants>["shadow"];
	export type CardRounded = VariantProps<typeof cardVariants>["rounded"];
	export type CardBlur = VariantProps<typeof cardVariants>["blur"];
	
	export type CardProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		size?: CardSize;
		shadow?: CardShadow;
		rounded?: CardRounded;
		blur?: CardBlur;
	};

</script>

<script lang="ts">
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		size = "lg",
		shadow = "lg",
		rounded = "lg",
		blur = "lg",
		children,
		...restProps
	}: CardProps = $props();
</script>

<div
	bind:this={ref}
	class={cn(cardVariants({ size, shadow, rounded, blur }), className)}
	{...restProps}
>
	{@render children?.()}
</div>
