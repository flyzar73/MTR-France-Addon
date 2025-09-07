package fr.mtrfranceaddon.mod.common.registry;

import fr.mtrfranceaddon.mod.common.util.Constants;
import org.mtr.mapping.holder.ItemConvertible;
import org.mtr.mapping.holder.ItemStack;
import org.mtr.mapping.registry.CreativeModeTabHolder;

public class ModItemGroups {

    public static final CreativeModeTabHolder MTRFranceAddonGroup = MTRFranceAddonRegistry.REGISTRY.createCreativeModeTabHolder(
            Constants.id("mtrfranceaddon_group"),
            () -> new ItemStack(new ItemConvertible(ModBlocks.MTRFRANCEADDON_LOGO.get().data))
    );

    public static final CreativeModeTabHolder TICKETS = MTRFranceAddonRegistry.REGISTRY.createCreativeModeTabHolder(
            Constants.id("mtrfranceaddon_tickets_group"),
            () -> new ItemStack(new ItemConvertible(ModBlocks.MTRFRANCEADDON_LOGO.get().data))
    );

}
