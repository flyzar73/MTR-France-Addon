package fr.mtrfranceaddon.registry;

import fr.mtrfranceaddon.Constants;
import org.mtr.mapping.holder.ItemConvertible;
import org.mtr.mapping.holder.ItemStack;
import org.mtr.mapping.registry.CreativeModeTabHolder;

public class ItemGroups {

    public static final CreativeModeTabHolder MTRFranceAddonGroup = MTRFranceAddonRegistry.REGISTRY.createCreativeModeTabHolder(
            Constants.id("mtrfranceaddon_group"),
            () -> new ItemStack(new ItemConvertible(ModBlocks.MTRFRANCEADDON_LOGO.get().data))
    );

}
