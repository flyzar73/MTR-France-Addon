package fr.mtrfranceaddon.mod.mixin;

import org.mtr.mod.data.ArrivalsCacheServer;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.ModifyArg;

@Mixin(ArrivalsCacheServer.class)
public class ArrivalsCacheServerMixin {

    @ModifyArg(
            method = "requestArrivalsFromServer",
            at = @At(
                    value = "INVOKE",
                    target = "Lorg/mtr/core/operation/ArrivalsRequest;<init>(Lorg/mtr/libraries/it/unimi/dsi/fastutil/longs/LongImmutableList;II)V"
            ),
            index = 1,
            remap = false
    )
    private int increaseMaxArrivals(int original) {
        return 30;
    }

}